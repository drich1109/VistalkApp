<script lang="ts">
    import Highcharts from "highcharts";
    import { onMount } from "svelte";

    export let weeklyScores: number[] = [];
    export let labels: string[] = [];

    let chartContainer: HTMLDivElement | null = null;
    let chart: Highcharts.Chart | null = null;

    // Function to render the chart
    function renderChart() {
        if (chartContainer) {
            // Destroy the existing chart instance if it exists
            if (chart) {
                chart.destroy();
            }
            // Create a new chart instance
            chart = Highcharts.chart(chartContainer, {
                chart: {
                    type: 'line',
                    marginRight: 10,
                },
                title: {
                    text: 'Weekly Score Graph',
                },
                xAxis: {
                    categories: labels,
                    title: {
                        text: 'Weeks',
                    },
                },
                yAxis: {
                    title: {
                        text: 'Points',
                    },
                },
                series: [{
                    name: 'Score',
                    data: weeklyScores,
                    type: 'line',
                }],
                tooltip: {
                    valueSuffix: ' pts',
                },
            });
        }
    }

    // Watch for changes to weeklyScores and labels
    $: renderChart();

    onMount(() => {
        renderChart();
    });
</script>

<div bind:this={chartContainer} style="height: 300px; width: 100%;"></div>
