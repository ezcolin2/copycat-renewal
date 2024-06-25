jest.mock("../schemas/room.js");
import Room from "../schemas/room.js"
import { findRoom } from "./room.js";
describe('findRoom', ()=>{
    test('방 찾기 성공', async ()=>{
    Room.findOne = jest.fn().mockResolvedValue({
        _id: "abc123",
        name: "test",
        master: "chulsoo"
    })
    const req = {
        params:{
            _id: "abc123"
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }
    const room = await findRoom(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        _id: "abc123",
        name: "test",
        master: "chulsoo"
    })
        
    })
})