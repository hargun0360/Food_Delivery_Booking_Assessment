#include <bits/stdc++.h>
using namespace std;

class Customer{
    int customerId;
    string source;
    string destination;
    string time;
    public:
    Customer(int customerId = 0 , string source = "", string destination = "", string time = ""){
        this->customerId = customerId;
        this->source = source;
        this->destination = destination;
        this->time = time;
    }
    void assignValues(int id){
        this->customerId = id;
        string source; cin>>source;
        this->source = source;
        string destination; cin>>destination;
        this->destination = destination;
        string time; cin>>time;
        this->time = time;
    }
    string getSource(){ return this->source; }
    string getDestination(){ return this->destination; }
    string getTime() const { return this->time; }
};

class DeliveryExecutive{
    int price;
    int extraOrders;
    int totalMoney;
    string source;
    string destination;
    int numberOfOrders;
    public:
    DeliveryExecutive(){
        this->price = 0;
        this->extraOrders = 0;
        this->totalMoney = 0;
        this->source = "";
        this->destination = "";
        this->numberOfOrders = 0;
    }

    int getPrice(){ return this->price; }
    int getExtraOrders(){ return this->extraOrders;}
    int getTotalMoney(){return this->totalMoney;}
    string getSource(){return this->source;}
    string getDestination(){return this->destination;}
    int getNumberOfOrders(){return this->numberOfOrders;}

    void setPrice(int price) { this->price = price; }
    void setExtraOrders(int extraOrders) { this->extraOrders = extraOrders; }
    void setSource(string source) { this->source = source ; }
    void setDestination(string destination) { this->destination = destination ; }
    void setNumberOfOrders(int numberOfOrders) { this-> numberOfOrders = numberOfOrders ; } 
    void setTotalMoney(int total) {this -> totalMoney = total;}

};

class Execution{
    public:

    string convertTo24HourFormat(const string& time12) {
        istringstream iss(time12);
        int hours, minutes;
        string am_pm;
        
        char delim;
        iss >> hours >> delim >> minutes >> am_pm;

        if (am_pm == "PM" && hours != 12) {
            hours += 12;
        } else if (am_pm == "AM" && hours == 12) {
            hours = 0;
        }

        ostringstream oss;
        oss << setw(2) << setfill('0') << hours << ":" 
            << setw(2) << setfill('0') << minutes;

        return oss.str();
    }

    pair<int, int> splitTime(const string& time) {
        int hours, minutes;
        sscanf(time.c_str(), "%d:%d", &hours, &minutes);

        return make_pair(hours, minutes);
    }   


    int timeDifference(const string& time1, const string& time2) {
        pair<int, int> split1 = splitTime(time1);
        pair<int, int> split2 = splitTime(time2);

        int totalMinutes1 = split1.first * 60 + split1.second;
        int totalMinutes2 = split2.first * 60 + split2.second;

        return (totalMinutes2 - totalMinutes1);
    }

    int findIndexOfMin(const vector<int>& arr) {
        return min_element(arr.begin(), arr.end()) - arr.begin();
    }


    void orderExecution(deque<Customer*> &dq , vector<DeliveryExecutive> &employees){
        int extra = 0;
        int orders = 0;
        int price = 0;
        while(!dq.empty()){

            string orderTime = convertTo24HourFormat(dq.front()->getTime());

            for(int i = 0; i < 5 ; i++){
                if((dq.front()->getSource() == employees[i].getSource()) and (dq.front()->getDestination() == employees[i].getDestination())){
                    // source and destinationn match 
                    string time = convertTo24HourFormat(dq.front()->getTime());

                    if(timeDifference(orderTime , time) <= 15 and timeDifference(orderTime , time) > 0){
                        extra++;
                        employees[i].setExtraOrders(extra);
                        price = employees[i].getPrice();
                        if(extra >= 1 and extra < 5){
                            orders++;
                            employees[i].setNumberOfOrders(orders);
                            price += 5;
                        }
                        employees[i].setPrice(price);
                    }else{
                        // find minimum element index of price and update 
                        // int index = findIndexOfMin();
                        extra = 0;
                        break;
                    }
                }else{
                    // not match source and destination
                     // find minimum element index of price and update
                     extra  = 0;
                     break;
                }
            }
        }
    }
};

int main(){

    deque <Customer*> dq;
    dq.push_back(new Customer(1,"A", "B", "9:00 AM"));
    dq.push_back(new Customer(2,"A", "B", "9:00 AM"));
    dq.push_back(new Customer(3,"A", "B", "9:00 AM"));
    dq.push_back(new Customer(4,"A", "B", "9:00 AM"));

    int n = 5;
    vector<DeliveryExecutive> employees(n);

    Execution* execution = new Execution();
    execution->orderExecution(dq,employees);

    return 0;
}