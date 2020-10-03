export class Spending{
    id: number;
    spending_type: String;
    detail: String;
    amount: number;
    spend_date: Date;
}
enum SpendingType {
    utility = "水电费",
    rent = "店铺租金",
    meal = "伙食费",
    other = "其他"
}