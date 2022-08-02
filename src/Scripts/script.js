let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const fetchDatePrefix = (day) => {
    day = day.toString();
    switch (day[day.length - 1]) {
        case "1":
            return "st"
            break;
        case "2":
            return "nd"
            break;
        case "3":
            return "rd"
            break;
        default:
            return "th"
            break;
    }
}
export const formatNum = (num) => {
    Number(num);
    if (num > 1) {
        return (Number(num.toFixed(0)).toLocaleString('en-UK'));
    } else if (String(num)[0] === "0" && String(num).length > 6) {
        return parseFloat(num).toFixed(4);
    } else {
        return num;
    }
}

export const formatProfit = (data) => {
    if (!data) {
        return;
    }
    if (Number(data) >= 0) {
        return (
            <span style={{ color: "var(--green)" }}>+{data.toFixed(3)}%</span>
        )
    } else {
        return (
            <span style={{ color: "var(--red)" }}>{data.toFixed(3)}%</span>
        )
    }
}

export function copyText(text) {
    navigator.clipboard.writeText(text);
}

export const formatDate = (date) => {
    let newDate = new Date(date);
    return (newDate.getDay() + fetchDatePrefix(newDate.getDay()) + "," + months[newDate.getMonth()] + " " + newDate.getFullYear())
    // return newDate
}

export const chartTimings = [
    {
        label: "5M",
        value: [1 / 288, "5M"],
    },
    {
        label: "15M",
        value: [1 / 96, "15M"],
    },
    {
        label: "30M",
        value: [1 / 48, "30M"],
    },
    {
        label: "1H",
        value: [1 / 24, "1H"],
    },
    {
        label: "12H",
        value: [1 / 2, "12H"],
    },
    {
        label: "1D",
        value: [1, "1D"],
    },
]