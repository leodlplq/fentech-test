import {
  Chart,
  ChartSize,
  PluginServiceGlobalRegistration,
  PluginServiceRegistrationOptions,
} from "chartjs";

interface ChartJsPluginRangeSelectExtendedOptions {
  rangeSelect?: RangeSelectOptions;
}

interface RangeSelectOptions {
  onSelectionChanged?: (filteredDataSets: Array<Array<any>>) => void;
  fillColor?: string | CanvasGradient | CanvasPattern;
  cursorColor?: string | CanvasGradient | CanvasPattern;
  cursorWidth?: number;
  state?: RangeSelectState;
}

interface RangeSelectState {
  canvas: HTMLCanvasElement;
}

interface ActiveSelection {
  x: number;
  w: number;
}

export class ChartJsPluginRangeSelect
  implements PluginServiceRegistrationOptions, PluginServiceGlobalRegistration
{
  public id = "rangeSelect";

  beforeInit(chartInstance: Chart, options?: any) {
    const opts = chartInstance.config
      .options as ChartJsPluginRangeSelectExtendedOptions;
    if (opts.rangeSelect) {
      const canvas = this.createOverlayCanvas(chartInstance);
      opts.rangeSelect = Object.assign({}, opts.rangeSelect, {
        state: { canvas: canvas },
      });
      chartInstance.canvas.parentElement.prepend(canvas);
    }
  }

  resize(chartInstance: Chart, newChartSize: ChartSize, options?: any) {
    const rangeSelectOptions = (
      chartInstance.config.options as ChartJsPluginRangeSelectExtendedOptions
    ).rangeSelect;
    if (rangeSelectOptions) {
      rangeSelectOptions.state.canvas.width = newChartSize.size.width;
      rangeSelectOptions.state.canvas.height = newChartSize.size.height;
    }
  }

  destroy(chartInstance: Chart) {
    const rangeSelectOptions = (
      chartInstance.config.options as ChartJsPluginRangeSelectExtendedOptions
    ).rangeSelect;
    if (rangeSelectOptions) {
      rangeSelectOptions.state.canvas.remove();
      delete rangeSelectOptions.state;
    }
  }

  private createOverlayCanvas(chart: Chart): HTMLCanvasElement {
    const rangeSelectOptions = (
      chart.config.options as ChartJsPluginRangeSelectExtendedOptions
    ).rangeSelect;
    const overlay = this.createOverlayHtmlCanvasElement(chart);
    const ctx = overlay.getContext("2d");

    let selection: ActiveSelection = { x: 0, w: 0 };
    let isDragging = false;

    chart.canvas.addEventListener("pointerdown", (evt) => {
      const rect = chart.canvas.getBoundingClientRect();
      selection.x = this.getXInChartArea(evt.clientX - rect.left, chart);
      isDragging = true;
    });

    chart.canvas.addEventListener("pointerleave", (evt) => {
      if (!isDragging) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
      }
    });

    chart.canvas.addEventListener("pointermove", (evt) => {
      ctx.clearRect(0, 0, chart.canvas.width, chart.canvas.height);

      const chartContentRect = chart.canvas.getBoundingClientRect();
      const currentX = this.getXInChartArea(
        evt.clientX - chartContentRect.left,
        chart
      );
      if (isDragging) {
        selection.w = currentX - selection.x;
        ctx.fillStyle = rangeSelectOptions.fillColor || "#00000044";
        ctx.fillRect(
          selection.x,
          chart.chartArea.top,
          selection.w,
          chart.chartArea.bottom - chart.chartArea.top
        );
      } else {
        const cursorWidth = rangeSelectOptions.cursorWidth || 1;
        ctx.fillStyle = rangeSelectOptions.cursorColor || "#00000044";
        ctx.fillRect(
          currentX,
          chart.chartArea.top,
          cursorWidth,
          chart.chartArea.bottom - chart.chartArea.top
        );
      }
    });

    chart.canvas.addEventListener("pointerup", (evt) => {
      const onSelectionChanged = rangeSelectOptions.onSelectionChanged;
      if (onSelectionChanged) {
        onSelectionChanged(this.getDataSetDataInSelection(selection, chart));
      }
      selection = { w: 0, x: 0 };
      isDragging = false;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    });
    return overlay;
  }

  private createOverlayHtmlCanvasElement(
    chartInstance: Chart
  ): HTMLCanvasElement {
    const overlay = document.createElement("canvas");
    overlay.style.position = "absolute";
    overlay.style.pointerEvents = "none";
    overlay.width = chartInstance.canvas.width;
    overlay.height = chartInstance.canvas.height;
    return overlay;
  }

  private getXInChartArea(val: number, chartInstance: Chart) {
    return Math.min(
      Math.max(val, chartInstance.chartArea.left),
      chartInstance.chartArea.right
    );
  }

  private getDataSetDataInSelection(
    selection: ActiveSelection,
    chartInstance: Chart
  ): Array<any> {
    const result = [];
    const xMin = Math.min(selection.x, selection.x + selection.w);
    const xMax = Math.max(selection.x, selection.x + selection.w);
    for (let i = 0; i < chartInstance.data.datasets.length; i++) {
      result[i] = chartInstance
        .getDatasetMeta(i)
        .data.filter((data) => xMin <= data.x && xMax >= data.x)
        .map((data) => {
          const index = data.$context.index;
          const value = chartInstance.data.datasets[i].data[index];
          const label = chartInstance.data.labels[index];

          return { value, label };
        });
    }
    return result;
  }
}
