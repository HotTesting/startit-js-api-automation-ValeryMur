import { Request } from "../framework/request";
import * as faker from "faker";
import { expect } from "chai";

describe("User flow", function() {
    it ("Get users list", async function() {
        // log in Admin
        let respAdminLogin = await new Request(
          "http://ip-5236.sunline.net.ua:30020/users/login"
        )
          .method("POST")
          .body({
            email: "test@test.com",
            password: "123456"
          })
          .send();

        console.log(respAdminLogin.body)
    
        // Get users list
        let userList = await new Request(
          `http://ip-5236.sunline.net.ua:30020/api/users`
        )
          .auth(respAdminLogin.body.token)
          .send();
    
        expect(userList.body, JSON.stringify(userList.body)).to.be.an("array");
        expect(userList.body[0], JSON.stringify(userList.body[0])).to.include.keys("_id", "username");
        expect(userList.statusCode, "status code of response").to.equal(200);
      });
    

    it ("get information about user", async function() {
       // log in Admin
        let respAdminLogin = await new Request(
          "http://ip-5236.sunline.net.ua:30020/users/login"
        )
          .method("POST")
          .body({
            email: "test@test.com",
            password: "123456"
          })
          .send();

          console.log("admin ID:" + respAdminLogin.body.id);
          //Get user info
        const respUserInfo = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${respAdminLogin.body.id}`)
            .auth(respAdminLogin.body.token)
            .send();

            console.log("user id:" + respUserInfo.body._id);
         
         expect(respUserInfo.body, JSON.stringify(respUserInfo.body)).to.be.an("object")
           .to.include.keys("_id", "profile");
         expect(typeof respUserInfo.body._id, respUserInfo.body._id).to.equal("string");
         
        });

    it ("user logged-in", async function() {
        // login Admin
        let respAdminLogin = await new Request(
          "http://ip-5236.sunline.net.ua:30020/users/login"
        )
          .method("POST")
          .body({
            email: "test@test.com",
            password: "123456"
          })
          .send();

          console.log("admin token:" + respAdminLogin.body.token);
        //Logged-in user
            let respUserLoggedin = await new Request(
                "http://ip-5236.sunline.net.ua:30020/api/user")
                .auth(respAdminLogin.body.token)
                .send();

                console.log(respUserLoggedin.body);

                expect(respUserLoggedin.body, JSON.stringify(respUserLoggedin.body))
                .to.be.an("object")
                .to.include.keys("_id", "createdAt", "emails", "username", "profile", "authenticationMethod", "isAdmin");
                expect(typeof respUserLoggedin.body.profile, respUserLoggedin.body.profile).to.not.equal(
                    "string")
                expect(typeof respUserLoggedin.body._id, respUserLoggedin.body._id).to.equal("string");
       
            }); 

    it ("delete user", async function(){
           // login Admin
        let respAdminLogin = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
          )
            .method("POST")
            .body({
              email: "test@test.com",
              password: "123456"
            })
            .send();

        console.log("admin token:" + respAdminLogin.body.token);

        const email = faker.internet.email(undefined, undefined, "gmai.com");
        //Register new user
        let respNewUser = await new Request(
                "http://ip-5236.sunline.net.ua:30020/users/register")
                .method("POST")
                .body ({
                    username: email,
                    email:    email,
                    password: "123456"
                    })
                .send();
                
        console.log("Create new user successful!", respNewUser.body);  
            
        //Delete user
        let respDeleteUser = await new Request(
                `http://ip-5236.sunline.net.ua:30020/api/users/${respNewUser.body.id}`)
               .method("DELETE")
               .auth(respAdminLogin.body.token)
               .send();

                console.log("Delete user successfuly!", respDeleteUser.body);
                expect(typeof respDeleteUser.body._id, JSON.stringify(respDeleteUser.body._id)).to.equal("string");
                expect(respDeleteUser.body, JSON.stringify(respDeleteUser.body)).to.include.keys("_id");
                expect(respDeleteUser.body._id, JSON.stringify(respDeleteUser.body._id)).to.equal(respNewUser.body.id);
       
            });

       /* it.only ("Register user with already existing email", async function(){
            const email = faker.internet.email(undefined, undefined, "gmai.com");
        //Register new user
        let respNewUser = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/register")
        try{
            respNewUser.method("POST")
                    .body ({
                        username: email,
                        email:  "test@test.com",
                        password: "123456"
                        })
                    .send();
        } catch(error)
        {
            expect(respNewUser.statusCode).to.equal(400);
            expect(respNewUser.body.reason).to.contain("Email already exists.");
        }

        });*/
    });
