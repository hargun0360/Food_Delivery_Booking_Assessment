class Booking {
    constructor(
        bookingId = 0,
        customerId = 0,
        restaurant = "",
        destination = "",
        orderTimeInMillis = 0,
        pickUpTimeInMillis = 0
    ) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.restaurant = restaurant;
        this.destination = destination;
        this.orderTimeInMillis = orderTimeInMillis;
        this.pickUpTimeInMillis = pickUpTimeInMillis;
    }
}

class DeliveryExecutive {
    constructor(
        name,
        deliveryCharge = 0,
        allowance = 0,
        bookings = []
    ) {
        this.name = name;
        this.deliveryCharge = deliveryCharge;
        this.allowance = allowance;
        this.bookings = bookings;
    }
}

class FoodDeliveryBooking {
    constructor(n) {
        this.deliveryExecutives = [];
        this.totalBookings = 0;

        for (let i = 0; i < n; i++) {
            const deliveryExecutive = new DeliveryExecutive("DE" + (i + 1));
            this.deliveryExecutives.push(deliveryExecutive);
        }
    }

    convertToMillis(orderTime) {
        const parts = orderTime.split(/[:\s]/);
        let hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const period = parts[2];

        if (hours !== 12) {
            hours += (period.toLowerCase() === "pm") ? 12 : 0;
        } else if (period.toLowerCase() === "am") {
            hours = 0;
        }

        return new Date().setHours(hours, minutes, 0, 0);
    }

    assignDeliveryExecutive(customerId, restaurant, destination, orderTime) {
       let timeSplit = orderTime.split(":");
console.log(timeSplit);

let hours = parseInt(timeSplit[0]);
let minutes = parseInt(timeSplit[1].split(" ")[0]);

if (hours > 12 || minutes >= 60 || hours < 0 || minutes < 0) {
    console.error("Invalid Time");
    return;
}

        const orderTimeInMillis = this.convertToMillis(orderTime);

        for (const deliveryExecutive of this.deliveryExecutives) {
            let extraOrder = 0;
            let previousPickUpTime = -1;

            for (const booking of deliveryExecutive.bookings) {
                if (booking.restaurant === restaurant &&
                    booking.destination === destination &&
                    orderTimeInMillis <= booking.pickUpTimeInMillis) {
                    extraOrder++;
                    previousPickUpTime = booking.pickUpTimeInMillis;
                }
            }

            if (extraOrder >= 1 && extraOrder < 5) {
                this.totalBookings++;
                this.showSummary(this.totalBookings, deliveryExecutive.name);

                deliveryExecutive.deliveryCharge += 5;

                deliveryExecutive.bookings.push(
                    this.addBooking(this.totalBookings, customerId, restaurant, destination, orderTimeInMillis, previousPickUpTime)
                );
                return;
            }
        }

        const minDeliveryCharge = Math.min(...this.deliveryExecutives.map(de => de.deliveryCharge));

        for (const deliveryExecutive of this.deliveryExecutives) {
            if (deliveryExecutive.deliveryCharge === minDeliveryCharge) {
                this.totalBookings++;
                this.showSummary(this.totalBookings, deliveryExecutive.name);

                deliveryExecutive.allowance += 10;
                deliveryExecutive.deliveryCharge += 50;

                deliveryExecutive.bookings.push(
                    this.addBooking(this.totalBookings, customerId, restaurant, destination, orderTimeInMillis)
                );
                return;
            }
        }
    }

    addBooking(
        bookingId,
        customerId,
        restaurant,
        destination,
        orderTimeInMillis,
        pickUpTimeInMillis = -1
    ) {
        const pickUpTime = (pickUpTimeInMillis === -1) ? orderTimeInMillis + 15 * 60 * 1000 : pickUpTimeInMillis;
        return new Booking(bookingId, customerId, restaurant, destination, orderTimeInMillis, pickUpTime);
    }

    showSummary(bookingId, deliveryExecName) {
        console.log("Booking ID:", bookingId);
        console.log("Available Executives:");
        console.log("Executive\tDelivery Charge Earned");

        for (const deliveryExecutive of this.deliveryExecutives) {
            console.log(deliveryExecutive.name, "\t\t\t", deliveryExecutive.deliveryCharge);
        }

        console.log("\nAllotted Delivery Executive:", deliveryExecName);
        console.log("-----------------------------------\n");
    }

    displayActivity(name) {
        const deliveryExecName = name.toUpperCase();
        const executive = this.deliveryExecutives.find(de => de.name === deliveryExecName);

        if (executive) {
            console.log("Name:", executive.name);
            console.log("Allowance: Rs.", executive.allowance);
            console.log("Delivery Charge: Rs.", executive.deliveryCharge);
        }
    }
}

// Test Cases
const foodDeliveryBooking = new FoodDeliveryBooking(5);


foodDeliveryBooking.assignDeliveryExecutive(1, "A", "B", "9:00 AM");
foodDeliveryBooking.assignDeliveryExecutive(2, "A", "B", "1111:11 AM");
foodDeliveryBooking.assignDeliveryExecutive(3, "A", "B", "9:30 AM");
foodDeliveryBooking.assignDeliveryExecutive(4, "A", "B", "9:35 AM");

foodDeliveryBooking.displayActivity("DE1");  