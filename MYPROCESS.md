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