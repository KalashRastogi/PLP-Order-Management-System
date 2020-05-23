import { LightningElement, wire, track, api } from 'lwc';
import getAllOrders from '@salesforce/apex/orderSummaryController.getAllOrders'
import submitForApproval from '@salesforce/apex/submitForApproval.submitForApproval';
import cancelStatus from '@salesforce/apex/cancelOrder.cancelStatus';
import updateOrderItem from '@salesforce/apex/orderSummaryController.updateOrderItem';
import deleteOrderItem from '@salesforce/apex/orderSummaryController.deleteOrderItem';

export default class OrderSummary extends LightningElement {
    @track Orders = [];
    @track OrderItemDetails = [];
    @track ind;
    @track indOuterLoop;
    @track indInnerLoop;
    @track totalQuan = 0;
    
    @track quan;
    @wire(getAllOrders)
    WiredOrders({ error, data }) {
        if (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                this.totalQuan = 0;
                this.OrderItemDetails = [];
                if (data[i].Payable_Amount__c != 0) {
                    for (var j = 0; j < data[i].OrderItems.length; j++) {
                        this.OrderItemDetails.push({
                            'OrderItemId': data[i].OrderItems[j].Id,
                            'Name': data[i].OrderItems[j].PricebookEntry.Product2.Name,
                            'ProductCode': data[i].OrderItems[j].PricebookEntry.Product2.ProductCode,
                            'Brand__c': data[i].OrderItems[j].PricebookEntry.Product2.Brand__c,
                            'Stock_Quantity__c': data[i].OrderItems[j].PricebookEntry.Product2.Stock_Quantity__c,
                            'Quantity': data[i].OrderItems[j].Quantity,
                            'showButton':false
                        });
                        this.totalQuan += data[i].OrderItems[j].Quantity;
                    }
                    this.Orders.push({
                        'OrderId': data[i].Id,
                        'OrderNumber': data[i].OrderNumber,
                        'TotalAmount': data[i].Payable_Amount__c,
                        'TotalQuantity': this.totalQuan,
                        'OrderItemDetails': this.OrderItemDetails
                    });
                }
            }
        }
        console.log(data);
        console.log(this.Orders);
        console.log(this.OrderItemDetails);
        if(error)
        console.log('Error in fetching data' + error);
    }
    onChangeQuantity(event){
        this.quan = event.target.value;
    }
    handleConfirm(event){
        this.ind = event.target.value;
        submitForApproval({opp: this.Orders[this.ind].OrderId});
        location.reload();
    }
    handleCancel(event){
        this.ind = event.target.value;
        cancelStatus({orderId: this.Orders[this.ind].OrderId});
        location.reload();
    }
    handleUpdate(event){
        this.indOuterLoop = event.target.dataset.i; 
        this.indInnerLoop = event.target.dataset.j;
        this.Orders[this.indOuterLoop].OrderItemDetails[this.indInnerLoop].showButton = true;
    }
    handleDelete(event){
        this.indOuterLoop = event.target.dataset.i; 
        this.indInnerLoop = event.target.dataset.j;
        deleteOrderItem({orderId: this.Orders[this.indOuterLoop].OrderId, 
                        itemId: this.Orders[this.indOuterLoop].OrderItemDetails[this.indInnerLoop].OrderItemId,
                        });
        location.reload();
    }
    saveClicked(event){
        this.indOuterLoop = event.target.dataset.i; 
        this.indInnerLoop = event.target.dataset.j; 
        updateOrderItem({orderId: this.Orders[this.indOuterLoop].OrderId,
                         itemId: this.Orders[this.indOuterLoop].OrderItemDetails[this.indInnerLoop].OrderItemId,
                         quantity: this.quan});
        location.reload();
    }
    cancelClicked(event){
        this.indOuterLoop = event.target.dataset.i; 
        this.indInnerLoop = event.target.dataset.j;
        this.Orders[this.indOuterLoop].OrderItemDetails[this.indInnerLoop].showButton = false;
    }
}