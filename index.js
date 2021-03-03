const axios = require('axios');
const proveedoresJSON = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json';
const clientesJSON = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';

let proveedores;
let clientes;
const getListaProveedores = async () => {
    try {
        const response = await axios.get(proveedoresJSON);
        proveedores = response.data;
    } catch (err) {
        return new InternalError('Something went wrong.');
    }
}
const getListaClientes = async () => {
    try {
        const response = await axios.get(clientesJSON);
        clientes = response.data;
    } catch (err) {
       return new InternalError('Something went wrong.');
    }
}

const fs = require('fs');
const http = require('http');

http
    .createServer(async function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html','charset':'utf-8'});
        let index = fs.readFileSync('index.html', {encoding:'utf-8',flag:'r'});
        if (req.url === '/api/proveedores') {
            await getListaProveedores();
            index = index.replace('{{head}}', `<th scope="col">ID</th>
            <th scope="col">Nombre Compañía</th>
            <th scope="col">Nombre Contacto</th>`);
            let body = '';
            for (let i = 0; i < proveedores.length; i++) {
                body += 
                `<tr>
                    <th scope="row">${proveedores[i].idproveedor}</th>
                    <td>${proveedores[i].nombrecompania}</td>
                    <td>${proveedores[i].nombrecontacto}</td>
                </tr>
                `;
            }
            index = index.replace('{{body}}', body);
            fs.writeFileSync('tablaProveedores.html', index);
            fs.createReadStream('tablaProveedores.html').pipe(res)
            fs.unlinkSync('tablaProveedores.html')
        }
        else if (req.url === '/api/clientes') {
            await getListaClientes();
            index = index.replace('{{head}}', `<th scope="col">ID</th>
            <th scope="col">Nombre Compañía</th>
            <th scope="col">Nombre Contacto</th>`);
            let body = '';
            for (let i = 0; i < clientes.length; i++) {
                body += 
                `<tr>
                    <th scope="row">${clientes[i].idCliente}</th>
                    <td>${clientes[i].NombreCompania}</td>
                    <td>${clientes[i].NombreContacto}</td>
                </tr>
                `;
            }
            index = index.replace('{{body}}', body);
            fs.writeFileSync('tablaClientes.html', index);
            fs.createReadStream('tablaClientes.html').pipe(res)
            fs.unlinkSync('tablaClientes.html')
        }
        res.end('Modifique la url')
    })
    .listen(8081);
