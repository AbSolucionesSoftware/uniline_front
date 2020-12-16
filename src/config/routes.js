//layout
import LayoutMaestro from '../components/Layout_Maestro/layout_maestro';
import LayoutUsers from '../components/Layout_User/layout_usuario';

//Admin pages
import DashboardMaestro from '../pages/maestro/Dashboard_maestro/dashboard';
import SubirCursoMaestro from '../pages/maestro/Subir_curso/subir_curso';
import CostosCursoMaestro from '../pages/maestro/Promociones_Precios/vista_promo_precio';

//Users pages
import Home from '../pages/users/Home/home';
import ResultadoBusqueda from '../pages/users/Busqueda/resultados_busqueda';
import Carrito from '../pages/users/Carrito/carrito';
import PagarCurso from '../pages/users/Compra_curso/pagar_curso';
import MisCursos from '../pages/users/Cursos_usuario/mis_cursos';
import DashboardUsuario from '../pages/users/Dashboard_Usuario/dashboard';
import PerfilUsuario from '../pages/users/Perfil_usuario/perfil';
import Politicas from '../pages/users/Politicas/politicas';
import RegistroLogin from '../pages/users/Registro_Login/vista_registro_login';
import VistaCurso from '../pages/users/Vista_curso/vista_curso';

//other
import Error404 from '../pages/error404';

const routes = [
	{
		path: '/instructor',
		component: LayoutMaestro,
		exact: false,
		routes: [
			{
				path: '/instructor/dashboard',
				component: DashboardMaestro,
				exact: true,
            },
            {
				path: '/instructor/dashboard/costo_curso',
				component: SubirCursoMaestro,
				exact: true,
            },
            {
				path: '/instructor/dashboard/contenido_curso',
				component: CostosCursoMaestro,
				exact: true,
			},
			{
				component: Error404
			}
		]
	},
	{
		path: '/',
		component: LayoutUsers,
		exact: false,
		routes: [
			{
				path: '/',
				component: Home,
				exact: true
			},
			{
				path: '/busqueda/:url',
				component: ResultadoBusqueda,
				exact: true
            },
            {
				path: '/carrito',
				component: Carrito,
				exact: true
            },
            {
				path: '/compra',
				component: PagarCurso,
				exact: true
            },
            {
				path: '/mis_cursos',
				component: MisCursos,
				exact: true
            },
            {
				path: '/dashboard/:url',
				component: DashboardUsuario,
				exact: true
            },
            {
				path: '/perfil',
				component: PerfilUsuario,
				exact: true
            },
            {
				path: '/politicas',
				component: Politicas,
				exact: true
            },
            {
				path: '/login',
				component: RegistroLogin,
				exact: true
            },
            {
				path: '/curso/:url',
				component: VistaCurso,
				exact: true
			},
			{
				component: Error404
			}
		]
	}
];

export default routes;
