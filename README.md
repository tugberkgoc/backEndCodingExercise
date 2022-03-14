# Trend Interview Take-home Exercise

This is a coding exercise designed to test back-end knowledge as well as coding skills for common features in a web application.
The entire set of tasks would take most mid-level front developers about 2-4 hours to finish, feel free to spend as much time as you would like. At Trend, we value the quality of the solutions not the scope or the time it takes to accomplish.

Just work through the tasks and see how many you can do in such a way that you are happy with how much you accomplished. You are free to use any library, framework, and previous code to accomplish the tasks. After submission you are free to make edits up and until the time we have agreed to review your code.

**To be totally clear, _THERE IS NO EXPECTATION FOR YOU TO COMPLETE ALL OF THE TASKS_!** It is strongly advised for you to satisfy the requirements of the user story first while keeping in mind the "things to consider during review" section of this exercise. BONUS tasks will differentiate you from other candidates if and only if you have successfully completed the requirements of the User Story first.

**Please fork the repository and share your version when done via email to luis@trend.io**

Thanks in advance for your time, happy coding!

## Assets Folder
Contains 2 files that have mock data that will be used in the exercise, please import the data into the memory of your script.

**transactions.json**
```json
{
    "id": "brand3",
    "stripeCustomerId": "1d0fd24c-4a99-4370-988c-6a8fd3118c56",
    "stripeChargeId": "b2d867ff-7d4f-4a65-b823-651b3945dbb5",
    "transactionDate": "1632070544", //Epoch Time
    "transactionType": "refund",
    "amountOfCredits": 10,
    "costPerCredit": "$95.00",
    "discount": "5.00%"
  },
```
**transactions_bigger.json**
Same as transactions but contains 1000 records

## User Story
As an administrator of Trend, I'd like to be able to know how brands on Trend are using their credits. To do this I need an API that I can give my front-end developer to use such that he can display the following information for each brand.

From beginning of time (01/03/2021) until end of time (03/04/2022)
- Total number of credits spent.
- Total number of credits bought.
- Total number of credits expired.

The api should be able to tell me how many credits brands have at any point in time, considering the following information for transactionType:
- buy - the brand adds credits to their account
- spend - the brand spends credits from their account
- refund - the brands gets credit refunded to their account
- expire - the brand has credit expired from their account based on promotional offers


## Tasks

- [✓] Process the transactions.json so that you can display the total number of credits spent, bought and expired for each brand. (http://localhost:9001/transactions/report?startDate=01/03/2021&endDate=03/04/2022)
- [ ] Process the transactions.json so that you get the number of credits a single brand has for a specific date. A function with inputs (date, brandId) that returns the number of credits: This number can be negative in some cases
- [ ] Process the transactions.json assuming each brand gets 100 credits per month added, and this information is not on the file.
- [✓] BONUS - Use a database and database queries to accomplish the tasks above. You will need to import the data into the database.
- [✓] BONUS - Create a single GET route to accomplish all of the tasks above, the result of the get route should be the output of the request in JSON format, while the inputs should be in the parameters of the request ex.\
**GET somedomain/transactions?action=buy&date=01312021&brandId=brand3** (This should return the amount of credits bought until 01/31/2022 for brand3)
- [✓] BONUS - Adapt your code if necessary to handle transactions_bigger.json


## Things to consider during your review

- Minimal Complexity
- Performance
- File Organization
- Ease of Maintenance
- Extensibility
- Reusability
- Clear Communication during commits
- Best Practices for Rendering

Good luck!
