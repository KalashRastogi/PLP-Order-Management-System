public with sharing class cancelOrder {
    @AuraEnabled
    public static void cancelStatus(Id orderId) {
        Order ord = [Select Id, Order_Status__c, Order_Remarks__c from Order where ID = :orderId];
        ord.Order_Status__c = 'Cancelled';
        ord.Order_Remarks__c = 'Cancelled via button';
        update ord;
    }
}