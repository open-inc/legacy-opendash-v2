export default ['opendash/services/eud', 'opendash/services/event', ($eud,$event) => {
    return {
        $onInit() {
            const selected = this.config.selected;
            const settings = this.config.settings;
            $eud.getItems()
                .then(items => $eud.getHistory(items, selected, settings))
                .then(history => $eud.getChart(history, settings))
                .then(graph => {

                    this.graph = graph;
                    this.loading = false;

                    $event.on(['od-widgets-resize', 'od-widgets-changed'], () => {
                        this.graph.getChartObj().reflow();

                    });

                });
        },
    };
}];
