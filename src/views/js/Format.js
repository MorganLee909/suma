export default class Format{
    static currency(num){
        return "$" + num.toFixed(2);
    }

    static transactionDate(date){
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${year}-${month}-${day}`;
    }

    static dollarsToCents(num){
        if(typeof num === "string") num = Number(num);

        return Math.round(num * 100);
    }

    static centsToDollars(num){
        return num / 100;
    }
}
