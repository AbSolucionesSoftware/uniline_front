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
				idCourse: idCourse._id
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

export const AdquirirCursoGratis = async (curso, user, token) => {
	return await clienteAxios
		.post(
			`/course/${curso._id}/inscription/course/free/user/${user._id}`,
			{ jalaporfa: 'jalaporfa2' },
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => res)
		.catch((err) => err);
};
