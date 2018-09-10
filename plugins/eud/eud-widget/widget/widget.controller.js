export default ['opendash/services/eud', 'opendash/services/event', '$q', ($eud, $event, $q) => {
    return {
        async $onInit() {
            try {
                const selected = this.config.selected;
                const settings = this.config.settings;

                let items = await $eud.getItems();
                let history = await $eud.getHistory(items, selected, settings);
                let graph = await $eud.getChart(history, settings);

                this.graph = graph;
                this.loading = false;

                if (this.widget && this.widget.onRequest) {
                    this.widget.onRequest('sharing:export', async () => {
                        return history.map(i => {
                            return {
                                id: i.item.id,
                                name: i.item.name,
                                history: i.history,
                            };
                        });
                    });
                }

                $event.on(['od-widgets-resize', 'od-widgets-changed'], () => {
                    this.graph.getChartObj().reflow();
                });

                await $q.resolve();
            } catch (error) {
                console.error('eud-widget error:', error);
            }
        },
    };
}];
