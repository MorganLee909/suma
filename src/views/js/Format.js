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
}
