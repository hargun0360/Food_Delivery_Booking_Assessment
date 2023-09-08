const readline = require('readline');

// Booking class definition
class Booking {
    constructor(
        bookingId = 0,
        customerId = 0,
        restaurant = "",
        destination = "",
        orderTimeInMillis = 0,
        pickUpTimeInMillis = 0,
    ) {
        // Initializing class properties
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.restaurant = restaurant;
        this.destination = destination;
        this.orderTimeInMillis = orderTimeInMillis;
        this.pickUpTimeInMillis = pickUpTimeInMillis;
    }
}

// DeliveryExecutive class definition
class DeliveryExecutive {
    constructor(name) {
        this.name = name;
        this.deliveryCharge = 0;
        this.allowance = 0;
        this.bookings = [];
        this.tripCounter = 1; 
    }
}

// Main FoodDeliveryBooking class
class FoodDeliveryBooking {
    constructor(n) {
        this.deliveryExecutives = [];
        this.totalBookings = 0;
        this.latestTimeInMillis = 0;
        this.extraDays = 0;

        // Initialize DeliveryExecutives
        for (let i = 0; i < n; i++) {
            this.deliveryExecutives.push(new DeliveryExecutive("DE" + (i + 1)));
        }
    }

    // Assign delivery executive to a booking
    assignDeliveryExecutive(customerId, restaurant, destination, orderTime) {
        const colonIdx = orderTime.indexOf(':');
        // Error check for time format
        if (parseInt(orderTime.substring(0, colonIdx)) > 12 || parseInt(orderTime.substring(0, colonIdx)) <= 0) {
            console.log("Error: Wrong time format!");
            return;
        }

        let orderTimeInMillis = new Date('1970/01/01 ' + orderTime).getTime() + this.extraDays * 24 * 60 * 60 * 1000;

        for (let deliveryExecutive of this.deliveryExecutives) {
            // Check if time crossed the day boundary
            if (orderTimeInMillis < this.latestTimeInMillis) {
                orderTimeInMillis += 24 * 60 * 60 * 1000;
                this.extraDays++;
                break;
            }

            let extraOrder = 0;
            let previousPickUpTime = -1;

            // Check if the delivery executive can take the order
            for (let booking of deliveryExecutive.bookings) {
                if (booking.restaurant === restaurant && booking.destination === destination && orderTimeInMillis <= booking.pickUpTimeInMillis) {
                    extraOrder++;
                    previousPickUpTime = booking.pickUpTimeInMillis;
                }
            }

            // Check the number of orders the delivery executive can take
            if (extraOrder >= 1 && extraOrder < 5) {
                this.totalBookings++;
                const bookingId = this.totalBookings;
                this.showSummary(bookingId, deliveryExecutive.name);

                deliveryExecutive.deliveryCharge += 5;
                deliveryExecutive.bookings.push(this.addBooking(bookingId, customerId, restaurant, destination, orderTimeInMillis, previousPickUpTime));

                this.latestTimeInMillis = orderTimeInMillis;
                this.extraDays++;
                return;
            }
        }

        // Find the delivery executive with the minimum delivery charge
        const minDeliveryCharge = Math.min(...this.deliveryExecutives.map(de => de.deliveryCharge));

        for (let deliveryExecutive of this.deliveryExecutives) {
            if (deliveryExecutive.deliveryCharge === minDeliveryCharge) {
                this.totalBookings++;
                const bookingId = this.totalBookings;
                this.showSummary(bookingId, deliveryExecutive.name);

                deliveryExecutive.allowance += 10;
                deliveryExecutive.deliveryCharge += 50;
                deliveryExecutive.bookings.push(this.addBooking(bookingId, customerId, restaurant, destination, orderTimeInMillis));

                this.latestTimeInMillis = orderTimeInMillis;
                return;
            }
        }
    }

    // Add a new booking
    addBooking(bookingId, customerId, restaurant, destination, orderTimeInMillis, pickUpTimeInMillis = -1) {
        const pickUpTime = pickUpTimeInMillis === -1 ? orderTimeInMillis + 15 * 60 * 1000 : pickUpTimeInMillis;
        return new Booking(bookingId, customerId, restaurant, destination, orderTimeInMillis, pickUpTime);
    }

    // Display booking summary
    showSummary(bookingId, deliveryExecName) {
        console.log("Booking ID:", bookingId);
        console.log("Available Executives:");
        console.log("Executive\tDelivery Charge Earned");

        this.deliveryExecutives.forEach(de => {
            console.log(`${de.name}\t\t\t${de.deliveryCharge}`);
        });

        console.log("\nAllotted Delivery Executive:", deliveryExecName);
        console.log("-----------------------------------\n");
    }

    // Display individual activity of a delivery executive
    displayActivity(name) {
        const deliveryExecName = name.toUpperCase();
        const exec = this.deliveryExecutives.find(de => de.name === deliveryExecName);
        if (exec && exec.deliveryCharge > 0) {
            console.log(exec.name , "\t\t\t\t" , exec.allowance , "\t\t\t\t" , exec.deliveryCharge, "\t\t\t\t\t" , exec.allowance + exec.deliveryCharge);
        }
    }

    // Convert milliseconds to time format
    millisecondsToTimeFormat(milliseconds) {
        const date = new Date(milliseconds);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hoursStr = hours < 10 ? '0' + hours : hours;
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        
        return hoursStr + ':' + minutesStr + ' ' + ampm;
    }

    // Display all delivery history
    displayAllHistory(name) {
        const deliveryExecName = name.toUpperCase();
        const exec = this.deliveryExecutives.find(de => de.name === deliveryExecName);
        if (exec && exec.deliveryCharge > 0) {
            let prevBooking = null;
            let orderCompletedCount = 0;
            let currentCharge = 0;  // Track the delivery charge for the current booking
    
            for (let i = 0; i < exec.bookings.length; i++) {
                if (!prevBooking || !this.areBookingsSame(prevBooking, exec.bookings[i])) {
                    if (prevBooking) {
                        console.log(exec.tripCounter, "\t", exec.name, "\t\t", prevBooking.restaurant, "\t\t", prevBooking.destination, "\t\t\t", orderCompletedCount, "\t\t\t", this.millisecondsToTimeFormat(prevBooking.pickUpTimeInMillis), "\t", this.millisecondsToTimeFormat(prevBooking.pickUpTimeInMillis + 30*60*1000), "\t\t", currentCharge);
                        exec.tripCounter++;  // Increment the trip counter after printing the previous booking
                    }
                    orderCompletedCount = 1;
                    prevBooking = exec.bookings[i];
                    currentCharge = (prevBooking.pickUpTimeInMillis === prevBooking.orderTimeInMillis + 15 * 60 * 1000) ? 50 : 5;  // Determine the charge for the current booking
                } else {
                    orderCompletedCount++;
                    currentCharge += 5;  // Increment the delivery charge if there's a subsequent booking with the same details
                }
            }
    
            if (prevBooking) {
                console.log(exec.tripCounter, "\t", exec.name, "\t\t", prevBooking.restaurant, "\t\t", prevBooking.destination, "\t\t\t", orderCompletedCount, "\t\t\t", this.millisecondsToTimeFormat(prevBooking.pickUpTimeInMillis), "\t", this.millisecondsToTimeFormat(prevBooking.pickUpTimeInMillis + 30*60*1000), "\t\t", currentCharge);
            }
        }
    }

    // Check if two bookings are the same
    areBookingsSame(booking1, booking2) {
        return booking1.restaurant === booking2.restaurant &&
               booking1.destination === booking2.destination &&
               booking1.pickUpTimeInMillis === booking2.pickUpTimeInMillis;
    }
}

// Readline interface setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility function to ask question and get input
function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

// Main function
async function main() {
    // Get the number of delivery executives
    const n = await askQuestion('Enter the number of delivery executives you want: ');
    const foodDeliveryBooking = new FoodDeliveryBooking(parseInt(n));

    // Get the number of orders and their details
    const m = await askQuestion('Enter the number of orders: ');

    for (let i = 0; i < parseInt(m); i++) {
        const source = await askQuestion(`Enter source for order ${i + 1}: `);
        const destination = await askQuestion(`Enter destination for order ${i + 1}: `);
        const time = await askQuestion(`Enter time for order ${i + 1} (e.g. 9:00 AM): `);

        foodDeliveryBooking.assignDeliveryExecutive(i + 1, source, destination, time);
    }

    // Show Delivery Summary
    console.log("\nTotal Earned: \n");
  
    console.log("Executive\t\t\t Allowance\t\t\t Delivery Charge\t\t\t Total");
    for(let i = 0; i < parseInt(n); i++) {
        foodDeliveryBooking.displayActivity(`DE${i + 1}`);
    }

    console.log("\nDelivery History: \n");

    console.log("Trip\t Executive\t Restaurant\t Destination Point\t Order Completed \t Pick Up Time\t Delivery Time\t Delivery Charge");
    for(let i = 0; i < parseInt(n); i++) {
        foodDeliveryBooking.displayAllHistory(`DE${i + 1}`);
    }

    rl.close();
}

// Call the main function to start the execution
main();
