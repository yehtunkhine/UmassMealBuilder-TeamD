import Sequelize from 'sequelize';

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb') // Example for postgres

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 
testConnection()
//create user
async function createUser(username, useremail, userphone){
  const newUser=await User.create({userID: Date.now()+"", name: username, email: useremail, phone: userphone});
  return JSON.stringify(newUser);
}

app.get('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser(req.name, req.email, req.phone)
    res.end(sendVal)
  })();

})

//retrieve user data
async function fetchUserData(username){
  let f_user =[];
  try{
    const users = await User.findAll({
      where: {
        name: username,
      }
    });
    users.forEach(user =>{
      f_user.push({
        id: user.userID,
        name: user.name,
        email: user.eamil,
        phone: user.phone
      })
    });
  } catch(err){
    console.log("Username does not exist");
  }
  return f_user;
}

app.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = fetchUserData(req.name)
    let str = JSON.stringify(users)
    res.end(str)
  })();
})
//fetch user restrictions
async function fetchUserRestrictions(userid){
  let user_rest= []
  try{
    const user_data= await UserRestriction.findAll({
      where:{
        userID: userid,
      }
    });
    user_rest.push(user_data.restriction)
  } catch(err){
    console.log("userId does not exist or has no restrictions")
  }
  return user_rest;
}

app.get('/getUserRestrictions', (req, res)=>{
  (async function getUserRestrictions(){
    let restrict = await fetchUserRestrictions(req.userid)
    res.end(restrict)
  })();
})








app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});