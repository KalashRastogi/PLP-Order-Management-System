public with sharing class orderSummaryController {
    public orderSummaryController() {}
    @AuraEnabled (cacheable = true)
    public static List<Order> getAllOrders()
    {
        List<Order> mylist = [
            SELECT OrderNumber,Payable_Amount__c, (SELECT PricebookEntry.Product2.Name, PricebookEntry.Product2.ProductCode, PricebookEntry.Product2.Brand__c, PricebookEntry.Product2.Stock_Quantity__c, Quantity, UnitPrice FROM OrderItems ) FROM Order order by OrderNumber desc
        ];
        return mylist;
    }
    @AuraEnabled
    public static void updateOrderItem(String orderId, String itemId, Decimal quantity){
        OrderItem item = [
            SELECT Quantity 
            FROM OrderItem
            WHERE OrderId = :orderId AND Id = :itemId
        ];
        item.Quantity = quantity;
        update item;
    }
    @AuraEnabled
    public static void deleteOrderItem(String orderId, String itemId){
        OrderItem item = [
            SELECT Id
            FROM OrderItem
            WHERE OrderId = :orderId AND Id = :itemId
        ];
        delete item;
    }
}
