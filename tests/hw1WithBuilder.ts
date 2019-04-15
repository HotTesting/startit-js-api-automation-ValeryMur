import { Request } from "../framework/request";
import * as faker from "faker";
import { expect } from "chai";

describe("User flow", function() {
    it("get information about user", async function() {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        const respAdminLogin = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
            console.log("user id:" + respAdminLogin.body.id);
        const respUserInfo = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${respAdminLogin.body.id}`)
            .method("GET")
            .send();

            console.log("user id:" + respUserInfo.body._id);
         /*expect(respUserInfo, JSON.stringify(respUserInfo))
            .to.be.an("object")
           // .to.include.any.keys("_id", "profile");
         expect(typeof respUserInfo.body._id, respUserInfo.body._id).to.equal("string");
         */
        });
    
        it ("users list", async function() {
            const respAdminLogin = await new Request(
                "http://ip-5236.sunline.net.ua:30020/users/login"
            )
                .method("POST")
                .body({
                    email: "test@test.com",
                    password: "123456"
                })
                .send();

                console.log(JSON.stringify(respAdminLogin.body));
            let respUsersList = await new Request(
                "http://ip-5236.sunline.net.ua:30020/api/users")
                .auth(respAdminLogin.body.token)
             
                console.log(JSON.stringify(respUsersList));
        //expect(JSON.stringify(respUsersList.body.statusCode)).to.equal(200);    
        //expect(respUsersList, JSON.stringify(respUsersList)).to.be.an("array");
        //expect(respUsersList[0], JSON.stringify(respUsersList[0])).to.include.keys("_id", "username");
    }); 
        
    
        it ("user logged-in", async function() {
            const respAdminLogin = await new Request(
                "http://ip-5236.sunline.net.ua:30020/users/login"
            )
                .method("POST")
                .body({
                    email: "test@test.com",
                    password: "123456"
                })
                .send();

            let respUserLoggedin = await new Request(
                "http://ip-5236.sunline.net.ua:30020/api/user")
                .auth(respAdminLogin.body.token)

                console.log(respUserLoggedin);

              /*  expect(respUserLoggedin, JSON.stringify(respUserLoggedin))
                .to.be.an("object")
                .to.include.keys("_id", "createdAt", "emails", "username", "profile", "authenticationMethod", "isAdmin");
                expect(typeof respUserLoggedin.body.profile, respUserLoggedin.bodyprofile).to.not.equal(
                    "string")
                expect(typeof respUserLoggedin.body._id, respUserLoggedin.body._id).to.equal("string");
       */
            }); 

        it ("delete user", async function(){
           const respAdminLogin = await new Request(
                "http://ip-5236.sunline.net.ua:30020/users/login"
            )
                .method("POST")
                .body({
                    email: "test@test.com",
                    password: "123456"
                })
                .send();

            const email = faker.internet.email(undefined, undefined, "gmai.com");
           let respNewUser = await new Request(
                "http://ip-5236.sunline.net.ua:30020/users/register")
                .method("POST")
                .body ({
                    username: email,
                    email:    email,
                    password: "123456"
                    })
                
                console.log("Create new user successful!", respNewUser);  
            
            let respDeleteUser = await new Request(
                `http://ip-5236.sunline.net.ua:30020/api/users/${respNewUser.body.id}`)
               .method("DELETE")
               .auth(respAdminLogin.body.token)

                console.log("Delete user successfuly!", respDeleteUser);
               /* expect(typeof respDeleteUser.body._id, JSON.stringify(respDeleteUser.body._id)).to.equal("string");
                expect(respDeleteUser, JSON.stringify(respDeleteUser)).to.include.keys("_id");
                expect(respDeleteUser.body._id, JSON.stringify(respDeleteUser.body._id)).to.equal(respNewUser.body.id);
       */
            });

    });
