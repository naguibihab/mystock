# Platform
###  Decision 1
The first decision I have to make is to decide what platform to use that can put something together quickly and without wasting anytime in setting it up, I rounded them down to two options:
- Angular + Firebase
- Angular + Nodejs + DynamoDb

I choose Firebase due to its ease and the ability to host on it.

### Decision 2
My Second decision was to use Angular seed or simply go with a Pure Angular application, Angular Seed seems like an overkill given that I don't need any routing but I decided to go with it anyway as it will be the quicker option and having the option to do easy routing later on might come in handy for a future version of this project.


# Code
### Decision 3
Because I'm hosting on github, I have to be careful with the kind of data that I put up there, I don't mind putting up my firebase config access but if I'll be using third partys' APIs such as Alpha Vintage, they might not appreciate having one of their keys public, so I've implemented a way to have environment variables that wouldn't be committed on git by following this article: https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/

### Issue faced 1
The main issue I'm facing at the moment is my lack of knowlege in Stock and how does it work and what kind of data do I need, at the moment I'm assuming the data that I need to show the user is a stock shrot name, price per stock, and a buy button, but I can't find this data in either Alpha Vantage or Quandl, so I'll have to keep digging

I found a way to get all the codes from Quandl: [http://help.quandl.com/article/92-how-do-i-download-the-quandl-codes-of-all-the-datasets-in-a-given-database]

I'm not sure where I can get the current stock info & their prices from the API, I'll just use what I have for now to show a working prototype

### Issue faced 2
I had an issue with the API dropping out (returning a CORS error) when I'm sending multiple requests at the same time, even though I can lower the amount of requests to 5 and that should be fine for the API I still can't risk having the API drop a request so I've implemented a way to have it send a single request at a time by using promises and recursion

### Issue faced 3
I wanted to add in pagination & improve the UI but due to time constraint I'll just skip that for now and focus on more important issues


### Shortcut 1
I want to have the http request handled in a single function, but to save time I'll have to handle each http request independantly (i.e. the one for calculating assets & the one for getting the page's content)
I decided to not include the asset calculation for this version