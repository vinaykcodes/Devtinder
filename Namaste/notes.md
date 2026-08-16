# 11 .2 .1

major-version.minor-version.patch
->major version will change entire repo
->and patch is for minor change like fixing a bug or any minimal issue
->minor version will only be change when we add new feature and its backward compatible
example-->
4.2.3
if i change it to 4.3.3 it will be compatible with all 4.X.X version

->^4.2.3->caret(^) changes the latest version of something while keeping safe to major version like
^4.2.3->(4).5.6

->~ tilda Allows updates to patch versions only while locking both major and minor version.
->~ and ^ are resposible for autoupdate version

# --> Route handler

app.use('/routehandler1',()=>,()=>,()=>{})
we can add as much route handler as we want
-->app.use('/route',(rq,rs,nxt)=>{
nxt()// it will throw flow of code to next route handler
})

# # -->(req,res,nxt)=>{

this function is known as middleware
}

# -->app.get('/route',(rq,rs,nxt)=>{

console.log("this is middleware no1);
nxt();
})
app.get('/route',(rq,rs,nxt)=>{
rs.send("done bro..");
console.log("this is middleware no2);

})
THIS WILL ALSO WORK

---> WORKING
Execution goes from all middleware.chain and end till any response is found

-->app.use()

- Used to mount middleware
- Works for all HTTP methods
- Matches any route that starts with the given path (prefix match)
  app.use("/user", (req, res, next) => {

  console.log("Middleware running");

  next();

});
👉 This will run for:

- /user
- /user/profile
- /user/settings

--->app.all()

- Used to handle all HTTP methods
- But matches only the exact route

app.all("/user", (req, res) => {
res.send("Handles all methods for /user");
});

👉 Works for:

- /user ✔️
  👉 Not for:
- /user/profile ❌

---> app.use("/",error,req,res,next)

-->app.get("/adminGetdata", (rq, rs, nxt) => {
console.log("Admin verified..!");

throw new Error("laude k error..");

});

app.use("/", (err, req, res, nxt) => {
if (err) {
res.status(500).send("an error has been encountered...");
}
}); --> alway use wild card in the end of the code

ANOTHER METHOND IS TYR CATCH

-->app.get("/adminGetdata", (rq, rs, nxt) => {

TRY{
throw new Error("laude k error..");
rs.send("dummy info")
}
catch(e){
rs.status(500).send("error hai ji..")
}

});

--> json is object with all key value pair in form of string
-->in the other hand js object are like key is like nonstring and value is type of string

-->model is like creating class for schema thereby we can create instance(object) for it and add it to database

-->app.use(()=>{
console.log("this is will work for every route");
})

-->app.use(express.json())// middleware for converting json(which we cant read) ->js object
-->await User.findByIdAndUpdate({ \_id: id }, {firstName:firstName}); this will only updata those feilds present on the schema

http://localhost:7777/user?name=Vinay&age=19 to get name and age we use req.query
http://localhost:7777/user/12233 to get id we use req.param.id

Schema level and api level sanitization and validation

## ref :"User" ,only works in feild consisting ObjectId(mongoose)

# connectionRequest.index({firstName:1})

# i dont want to send 999(all user feed) for new user

# will use technique Pagination to send only 10 users feed at once

# /feed?page=1&limit=10 => will get 1-10 users ====> skip(0).limit=10 first ten user

# /feed?page=2&limit=10 => will get 11-20 users====> skip(10).limit=10 11-20

# /feed?page=3&limit=10 => will get 21-30 users====> skip(20).limit=10 21-30

# /feed?page=4&limit=10 => will get 31-40 users====> skip(30).limit=10 31-40

## Here limit is changing and only skip value is dynamic so formula of skip is k=skip=(page-1)*limit



## Deployment

## singin and createInstance
## geneate .pem file