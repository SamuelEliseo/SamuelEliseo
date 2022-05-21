using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CAEP.Miscelaneos
{
    public class Menu
    {
        public string nombreLogico = "", nombreLogicoPadre="", menu, url, imagen = "";
        public List<Menu> items = new List<Menu>();
        public bool seleccionado = false, expandido = false;

        public Menu setNombreLogico(string _NombreLogico)
        {
            this.nombreLogico = _NombreLogico;
            return this;
        }

        public Menu setImagen(string _Imagen)
        {
            this.imagen = _Imagen;
            return this;
        }

        public Menu setMenu(string _Menu)
        {
            this.menu = _Menu;
            return this;
        }

        public Menu setUrl(string _Url)
        {
            this.url = _Url;
            return this;
        }

        public Menu addMenuHijo(Menu menuHijo)
        {
            this.items.Add(menuHijo);
            return this;
        }

        public Menu setSeleccionado(bool _seleccionado)
        {
            this.seleccionado = _seleccionado;
            return this;
        }

        public Menu setExpandido(bool _expandido)
        {
            this.expandido = _expandido;
            return this;
        }
    }
}
