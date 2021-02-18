import clienteAxios from '../../../config/axios';

export const CanjearCupon = async (token, user, curso, cupon) => {
	return await clienteAxios
		.put(
			`/course/coupon/exchange/`,
			{
				idUser: user._id,
				idCourse: curso.course._id,
				code: cupon
			},
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => res)
		.catch((err) => err);
};

export const AgregarCarritoBD = async (token, user, idCourse) => {
	return await clienteAxios
		.post(
			`/cart/${user._id}`,
			{
				idCourse: idCourse
			},
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => res)
		.catch((err) => err);
};
