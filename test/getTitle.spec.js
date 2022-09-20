const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const requestApi = async (url) => {
    const response = await chai.request("http://localhost:3001").get(url);
    return response;
};
describe("get title with await", () => {
    it("it should look for address", async () => {
        const response = await requestApi("/I/want/title/await?address");
        expect(response).status(400);
        expect(response.text).to.equal("Address is empty");
        expect(response.body).to.be.empty;
    });
    it("should look for invalid url", async () => {
        const inAccurateRes = await requestApi("/I/want/title/await?address=www");
        expect(inAccurateRes).status(406);
        expect(inAccurateRes.body).to.equal("Invalid URL in address");
    });
    it("should look for multiple invalid urls", async () => {
        const inAccurateRes = await requestApi("/I/want/title/await?address=www.google.com&address=www");
        expect(inAccurateRes).status(404);
        expect(inAccurateRes.text).to.equal("Invalid URL in address");
    });
    it("should look for single url response", () => {});
});
