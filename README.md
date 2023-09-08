# Food Delivery Booking System

## Overview

The system is built with Node.js and handles various tasks associated with the booking and management of orders for a food delivery service. The primary tasks include:
- Handling individual bookings from customers.
- Assigning delivery executives based on specific criteria.
- Displaying the delivery executive's activities and earnings.

## Features

- **Booking Management:** The system can manage and store individual booking details, including customer ID, restaurant, destination point, and booking time.
  
- **Dynamic Executive Assignment:** Delivery executives are assigned based on the earned delivery charges, ensuring fair distribution of orders.
  
- **Earnings Calculation:** The system calculates and displays the earnings of each executive based on both delivery charges and allowances.
  
- **Delivery History:** A detailed history of each executive's deliveries can be viewed, showing details like restaurant, destination point, orders completed, pickup time, and delivery time.

## How the System Works

1. **Booking Handling:** When a booking is made, it's stored with essential details including the customer ID, restaurant, destination, and time.
  
2. **Executive Assignment:** 
   - If multiple orders come from the same location within a 15-minute period, they are combined, up to a maximum of 5 orders per executive.
   - The delivery executive who has earned the least is given preference for the next booking. This ensures fair distribution of tasks and earnings.
  
3. **Earnings Calculation:**
   - Every single order has a delivery charge of Rs 50 for the executive.
   - For combined orders, the delivery charge is the base rate of Rs.50 + Rs.5 for every other order.
   - An allowance of Rs.10 is given for every trip made. Combined orders are counted as one trip.
  
4. **Display Executive Activities:** At any time, you can view the details of each executive's activities, including the commission earned and the allowance earned.

## Edge Cases Handled

- **Time Overflow:** If the order time provided is less than the latest time, an extra day is added to manage 24-hour time format overflow.
  
- **Multiple Orders:** Orders from the same location and restaurant within a 15-minute window are combined up to 5 orders. This ensures efficient delivery and better earnings for the delivery executive.
  
- **Time Format:** The system checks and ensures the time format is correct. Any wrong format throws an error.

## Complexity

- **Time Complexity:** 
  - Booking Handling: O(1) 
  - Executive Assignment: O(n), where n is the number of delivery executives. 
  - Displaying Activities: O(n) for displaying all delivery executive details.

- **Space Complexity:** O(n), where n is the total number of bookings made.

## Conclusion

The Food Delivery Booking System efficiently manages the process of order booking and assignment to delivery executives. It ensures fairness in task distribution and calculates earnings accurately. The system has been tested and handles various edge cases to ensure smooth operations.
