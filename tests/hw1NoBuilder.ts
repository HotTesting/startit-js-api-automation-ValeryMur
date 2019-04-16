import * as request from "request-promise-native";
import * as faker from "faker";
import { expect } from "chai";

describe ("User flow", function() {
    it("successful login", async function() {
        let respAdminLogin = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
            }
        );
        console.log("Login successful!", respAdminLogin);
        expect(respAdminLogin, JSON.stringify(respAdminLogin))
        .to.be.an("object")
        .that.has.all.keys("token", "tokenExpires", "id");
    });

    it ("user register", async function(){
        const email = faker.internet.email(undefined, undefined, "gmai.com");
        console.log("user email:" + email);
        let respNewUser = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/register",
            {
                json: true,
                body: {
                username: email,
                email:    email,
                password: "123456"
                }
            });
            console.log("Create new user successful!", respNewUser);    
            expect(respNewUser, JSON.stringify(respNewUser))
            .to.be.an("object")
            .to.include.keys("token", "tokenExpires", "id"); 
        });

    it ("user information", async function() {
        let respAdminLogin = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
            }
        );
        console.log("Login successful!", respAdminLogin);
        const respUserInfo = await request.get(
            `http://ip-5236.sunline.net.ua:30020/api/users/${respAdminLogin.id}`,
            {
            headers: {
                Authorization: `Bearer ${respAdminLogin.token}`
                },
            json: true
            }); 
            console.log("Info about user", respUserInfo);
         expect(respUserInfo, JSON.stringify(respUserInfo))
            .to.be.an("object")
            .to.include.keys("_id", "profile");
         expect(typeof respUserInfo._id, respUserInfo._id).to.equal("string");
    }); 

    it ("delete user", async function(){
        let respAdminLogin = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
            }
        );
        console.log("Login successful!", respAdminLogin);
        const email = faker.internet.email(undefined, undefined, "gmai.com");
       let respNewUser = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/register",
            {
                json: true,
                body: {
                username: email,
                email:    email,
                password: "123456"
                }
            });
            console.log("Create new user successful!", respNewUser);  
        
        let respDeleteUser = await request.delete(
            `http://ip-5236.sunline.net.ua:30020/api/users/${respNewUser.id}`,
            {
            headers: {
                Authorization: `Bearer ${respAdminLogin.token}`
                },
            json: true
            });
            console.log("Delete user successfuly!", respDeleteUser);
            expect(typeof respDeleteUser._id, JSON.stringify(respDeleteUser._id)).to.equal("string");
            expect(respDeleteUser, JSON.stringify(respDeleteUser)).to.include.keys("_id");
            expect(respDeleteUser._id, JSON.stringify(respDeleteUser._id)).to.equal(respNewUser.id);
    });

    it ("users list", async function() {
            let respAdminLogin = await request.post(
                "http://ip-5236.sunline.net.ua:30020/users/login",
                {
                    json: true,
                    body: {
                        email: "test@test.com",
                        password: "123456"
                    }
                }
            );
            console.log("Login successful!", respAdminLogin);
        let respUsersList = await request.get(
            "http://ip-5236.sunline.net.ua:30020/api/users",
            {
            headers: {
                Authorization: `Bearer ${respAdminLogin.token}`
                },
            json: true
            }); 
            console.log("Users list", respUsersList);

    //expect(JSON.stringify(respUsersList.statusCode)).to.equal(200);    
    expect(respUsersList, JSON.stringify(respUsersList)).to.be.an("array");
    expect(respUsersList[0], JSON.stringify(respUsersList[0])).to.include.keys("_id", "username");
}); 
    

    it ("user logged-in", async function() {
        let respAdminLogin = await request.post(
            "http://ip-5236.sunline.net.ua:30020/users/login",
            {
                json: true,
                body: {
                    email: "test@test.com",
                    password: "123456"
                }
            }
        );
        console.log("Login successful!", respAdminLogin);
        let respUserLoggedin = await request.get(
            "http://ip-5236.sunline.net.ua:30020/api/user",
            {
            headers: {
                Authorization: `Bearer ${respAdminLogin.token}`
                },
            json: true
            }); 
            console.log("User logged-in", respUserLoggedin);
            expect(respUserLoggedin, JSON.stringify(respUserLoggedin))
            .to.be.an("object")
            .to.include.keys("_id", "createdAt", "emails", "username", "profile", "authenticationMethod", "isAdmin");
            expect(typeof respUserLoggedin.profile, respUserLoggedin.profile).to.not.equal(
                "string")
            expect(typeof respUserLoggedin._id, respUserLoggedin._id).to.equal("string");
    }); 
});
