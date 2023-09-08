# Food Delivery Booking System

This system is developed to handle bookings and assign delivery executives for a food delivery company. 

## Overview

The system, built using Node.js, manages tasks for a food delivery service including booking orders and managing delivery executives.

## Features

- **Booking Management**: Manage and store individual booking details such as customer ID, restaurant, destination point, and booking time.
- **Dynamic Executive Assignment**: Delivery executives are allocated orders based on the delivery charges they've earned to ensure fairness.
- **Earnings Calculation**: Displays the earnings of each executive, calculated from delivery charges and allowances.
- **Delivery History**: View detailed history of each executive's deliveries, with specifics on restaurant, destination, number of orders, pickup, and delivery time.

## How the System Works

1. **Booking Handling**: Bookings are stored with essential details like customer ID, restaurant, destination, and time.
2. **Executive Assignment**: Orders from the same location within 15 minutes are combined, up to 5 orders per executive. The least earning delivery executive is prioritized.
3. **Earnings Calculation**: 
   - Single order: Rs 50 delivery charge.
   - Combined orders: Rs.50 base rate + Rs.5 for each additional order.
   - Every trip, including combined orders, earns Rs.10 allowance.
4. **Display Executive Activities**: View executive's commission, allowance, and other activities.

## Sample Optput 



## Edge Cases Handled

- **Time Overflow**: Manages 24-hour time format overflow if an order's time is lesser than the latest time.
- **Multiple Orders**: Efficiently combines up to 5 orders from the same restaurant within a 15-minute window.
- **Time Format**: Checks for valid time formats.

## Complexity

- **Time Complexity**:
  - Booking Handling: O(1)
  - Executive Assignment: O(n) - `n` being number of delivery executives.
  - Displaying Activities: O(n) - for all delivery executive details.
- **Space Complexity**: O(n) - `n` being total bookings.

## Conclusion

The Food Delivery Booking System streamlines the order booking process and ensures fair distribution of tasks among delivery executives. It's designed to handle various edge cases for seamless operation.
