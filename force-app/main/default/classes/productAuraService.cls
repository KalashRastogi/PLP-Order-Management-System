public with sharing class productAuraService {
    public productAuraService() {

    }
    @AuraEnabled(cacheable=true)
    public static list<sObject> getProductList(String name){
        String key = '%' + name + '%';
        return [SELECT Product2.Name, Product2.Id,  Product2.Brand__c, (SELECT PricebookEntry.Id, PricebookEntry.ProductCode, PricebookEntry.UnitPrice FROM PricebookEntries WHERE PricebookEntry.Pricebook2Id = '01s2x00000088sHAAQ') FROM Product2 WHERE Name LIKE :key];
    }
    @AuraEnabled
    public static void insertOrderItem(String OId, String PId, String PEId, Integer Qua, Decimal UP){
            OrderItem orders = new OrderItem(OrderId = Id.valueOf(OId), Product2Id = Id.valueOf(PId), PricebookEntryId = Id.valueOf(PEId), Quantity = Qua, UnitPrice = UP);
            insert orders; 
    } 
}
