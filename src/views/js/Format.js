export default class Format{
    static currency(num){
        num /= 100;
        return "$" + num.toFixed(2);
    }

    static transactionDate(d){
        return d.toISOString().split("T")[0];
    }

    static dateFromTransaction(d, dayOfWeek = false){
        const date = new Date(d);

        let options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: dayOfWeek ? "long" : undefined
        };

        return date.toLocaleDateString("en-US", options);
    }

    static dollarsToCents(num){
        if(typeof num === "string") num = Number(num);

        return Math.round(num * 100);
    }

    static centsToDollars(num){
        return num / 100;
    }

    static percentToAmount(percent, income){
        return (percent / 100) * income;
    }

    static amountToPercent(amount, income){
        return (amount / income) * 100;
    }
}
