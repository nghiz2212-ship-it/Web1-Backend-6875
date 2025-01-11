const CauHoi = require('../../model/CauHoi');

require('dotenv').config();

module.exports = {

    getCauHoi: async (req, res) => {
        try {
            let { page, limit, search, sort, order } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);           

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            if (search) {
                const searchKeywords = (search || '')
                const keywordsArray = searchKeywords.trim().split(/\s+/);

                const searchConditions = keywordsArray.map(keyword => ({
                    cauHoi: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
                }));

                query.$or = searchConditions;
            }

            let sortOrder = 1; // tang dn
            if (order === 'desc') {
                sortOrder = -1; 
            }
            console.log("sortOrder: ", sortOrder);                              

            let cauHoi = await CauHoi.find(query).skip(skip).limit(limitNumber).sort({ [sort]: sortOrder })           

            const totalCauHoi = await CauHoi.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalCauHoi / limitNumber); // Tính số trang

            if(cauHoi) {
                return res.status(200).json({
                    message: "Đã tìm ra câu hỏi",
                    errCode: 0,
                    data: cauHoi,     // tổng số sản phẩm
                    totalCauHoi,
                    totalPages,
                    currentPage: pageNumber,
                })
            } else {
                return res.status(500).json({
                    message: "Tìm câu hỏi thất bại!",
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

    createCauHoi: async (req, res) => {
        try {
            let {fullName, email, cauHoi} = req.body                        

            let createTL = await CauHoi.create({fullName, email, cauHoi})

            if(createTL){
                return res.status(200).json({
                    message: "Bạn đã Tạo câu hỏi thành công!",
                    errCode: 0,
                    data: createTL
                })
            } else {
                return res.status(500).json({
                    message: "Bạn Tạo câu hỏi thất bại!",                
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

    updateCauHoi: async (req, res) => {
        try {
            let {_id, fullName, email, cauHoi, cauTraLoi} = req.body

            let updateTL = await CauHoi.updateOne({_id: _id},{fullName, email, cauHoi, cauTraLoi})

            if(updateTL) {
                return res.status(200).json({
                    data: updateTL,
                    message: "Trả lời câu hỏi thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Trả lời câu hỏi thất bại"
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

    deleteCauHoi: async (req, res) => {
        try {
            const _id = req.params.id
            let xoaTL = await CauHoi.deleteOne({_id: _id})

            if(xoaTL) {
                return res.status(200).json({
                    data: xoaTL,
                    message: "Bạn đã xoá câu hỏi thành công!"
                })
            } else {
                return res.status(500).json({
                    message: "Bạn đã xoá câu hỏi thất bại!"
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
}