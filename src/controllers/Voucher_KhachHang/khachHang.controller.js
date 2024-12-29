const mongoose = require('mongoose');  // Đảm bảo bạn đã import mongoose
const AccKH = require('../../model/AccKH');
const HopQua = require('../../model/HopQua');


require('dotenv').config();

module.exports = {

    getAccKH: async (req, res) => {
        try {
            const { page, limit, fullName } = req.query; 
    
            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
    
            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;
    
            // Tạo query tìm kiếm
            const query = {};
            if (fullName) {
                const searchKeywords = fullName.trim().split(/\s+/).map(keyword => {
                    const normalizedKeyword = keyword.toLowerCase();  // Chuyển tất cả về chữ thường để không phân biệt
                    return {
                        $or: [
                            { fullName: { $regex: normalizedKeyword, $options: 'i' } },  
                            { email: { $regex: normalizedKeyword, $options: 'i' } },                                 
                            { address: { $regex: normalizedKeyword, $options: 'i' } },                                 
                        ]
                    };
                }).flat();  // flat() để biến các mảng lồng vào thành một mảng phẳng
            
                query.$and = searchKeywords;  // Dùng $and để tìm tất cả các từ khóa
            }
    
            let accKH = await AccKH.find(query).populate("IdVoucher").skip(skip).limit(limitNumber)

            const totalAccKH = await AccKH.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalAccKH / limitNumber); // Tính số trang
                       
            if(accKH) {
                return res.status(200).json({
                    message: "Đã tìm ra acc kh",
                    errCode: 0,
                    data: accKH,
                    totalAccKH,
                    totalPages,
                    currentPage: pageNumber,
                })
            } else {
                return res.status(500).json({
                    message: "Tìm thể loại thất bại!",
                    errCode: -1,
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }        
    },    
  
    updateAccKH: async (req, res) => {
        try {
            const { id, fullName, IdVoucher, quayMayManCount } = req.body;
            console.log("id: ", id);
            console.log("fullname: ", fullName);
            console.log("IdVoucher: ", IdVoucher);                           
                
            const updateResult = await AccKH.updateOne(
                { _id: id }, // Điều kiện tìm kiếm tài liệu cần cập nhật
                { IdVoucher, fullName, quayMayManCount }
            );

            if(updateResult) {
                // Trả về kết quả thành công
                return res.status(200).json({
                    message: "Cập nhật Voucher cho khách hàng thành công!",
                    data: updateResult
                });
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa thất bại"
                })
            }                    
        } catch (error) {
            console.error("Lỗi khi cập nhật Voucher cho khách hàng:", error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message
            });
        }
    },
    
    deleteAccKH: async (req, res) => {
        try {
            const id = req.params.id
            let xoa = await AccKH.deleteOne({_id: id})

            if(xoa) {
                return res.status(200).json({
                    data: xoa,
                    message: "Bạn đã xóa tài khoản khách hàng thành công!"
                })
            } else {
                return res.status(500).json({
                    message: "Bạn đã xóa tài khoản khách hàng thất bại!"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }
    },

    khoaAccKH: async (req, res) => {
        try {
            // const id = req.params.id
            const { id, isActive } = req.body;

            const updatedAccount = await AccKH.findByIdAndUpdate(id, { isActive }, { new: true });

            if (updatedAccount) {
                return res.status(200).json({ message: "Cập nhật thành công", data: updatedAccount });
            } else {
                return res.status(404).json({ message: "Tài khoản không tìm thấy" });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }
    },

    getOneAccKH: async (req, res) => {
        try {
            const id = req.query.id; 
            console.log("id: ", id);
                            
            let accKH = await AccKH.find({_id: id}).populate("IdVoucher")
                       
            if(accKH) {
                return res.status(200).json({
                    message: "Đã tìm ra acc kh",
                    errCode: 0,
                    data: accKH,                    
                })
            } else {
                return res.status(500).json({
                    message: "Tìm thể loại thất bại!",
                    errCode: -1,
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        }        
    },  
    
    quaySoMayMan: async (req, res) => {
        try {
            let { userId } = req.body;
            console.log("userId: ", userId);
            
            // Lấy thông tin khách hàng
            const user = await AccKH.findById(userId);
    
            // Kiểm tra xem người dùng có còn lượt quay không
            if (user.quayMayManCount <= 0) {
                return res.status(500).json({
                    message: "Bạn đã hết lượt quay số may mắn.",
                    errCode: -1,
                })
            }
    
            // Giảm số lần quay đi 1
            user.quayMayManCount -= 1;
    
            // Lưu lại thay đổi
            await user.save();

            return res.status(200).json({
                message: "Quay số thành công!",
                errCode: 0,
                // prize,  // Trả về phần thưởng
                quayMayManCount: user.quayMayManCount,
            });
                           
        } catch (error) {
            throw new Error(error.message);
        }
    }
  
}