exports.searchUser = async (req,res) => {
	try{
		
			let searchItem = req.params.search;
			try {
				let users = await User.aggregate([
					{
						$match: {
							$and: [
								{ fullName: { $regex: searchItem, $options: 'i' } },
								{ isDeleted: false },
								{ role: { $ne: 'admin' } }
							]
						}
					}
				]).sort({ _id: -1 })
				.limit(parseInt(req.params.limit) || 10)
				.skip(parseInt(req.params.offset) - 1)
				.exec();
				 let totalRecords = users.length
				return res.status(200).send({ status: true, message: constant.RETRIEVE_USER ,users, totalRecords });
			} catch (error) {
				console.log('ERROR:::', error);
				return res.status(500).json({ status: false, message: error.message });
			}
	
	}
	catch(error) {
		return res.status(500).json({ status: false, message: error.message });
	}
}