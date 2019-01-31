export const radarOption = {
    radar: {
        // shape: 'circle',
        name: {
            textStyle: {
                color: "#fff",
                borderRadius: 3,
                padding: [0, 0]
            }
        },
        radius: 75,
        indicator: [
            { name: "爱情", max: 100 },
            { name: "财运", max: 100 },
            { name: "健康", max: 100 },
            { name: "工作", max: 100 },
            { name: "综合", max: 100 }
        ]
    },
    series: [
        {
            type: "radar",
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: "#0079ff"
                    },
                    areaStyle: {
                        color: "yellow"
                    }
                }
            },
            data: [
                {
                    value: [70, 10, 28, 35, 50]
                }
            ]
        }
    ]
};