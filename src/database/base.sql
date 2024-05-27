CREATE DATABASE Inventario;
GO
USE Inventario;
GO
---------------------------------------TABLAS-----------------------
CREATE TABLE Paises
(
	IdPais int identity(1,1) not null,
	NombrePais varchar(30) not null,
	constraint PK_pais primary key(IdPais),
	constraint UQ_pais unique(NombrePais)
);

CREATE TABLE Estados
(
	IdEstado int identity(1,1) not null,
	NombreEstado varchar(50) not null,
	IdPais int not null,
	constraint PK_estado primary key(IdEstado),
	constraint FK_paisTOestado foreign key(IdPais) references Paises(IdPais) on delete cascade,
	constraint UQ_estado unique(NombreEstado)
);

CREATE TABLE Municipios
(
	IdMunicipio int identity(1,1) not null,
	NombreMunicipio varchar(50) ,
	IdEstado int not null,
	constraint PK_municipio primary key(IdMunicipio),
	constraint FK_estadoTOmunicipio foreign key(IdEstado) references Estados(IdEstado) on delete cascade,
);

CREATE TABLE CodigosPostales
(
	IdCodigoPostal int identity(1,1) not null,
	CodigoPostal int not null,
	IdMunicipio int not null,
	constraint PK_CodigoPostal primary key(IdCodigoPostal),
	constraint FK_municipioTOcodigopostal foreign key(IdMunicipio) references Municipios(IdMunicipio) on delete cascade,
);

CREATE TABLE Colonias
(
	IdColonia int identity(1,1) not null,
	NombreColonia varchar(50),
	IdCodigoPostal int,
	constraint PK_colonia primary key(IdColonia),
	constraint FK_CodigosPostalesTOcolonia foreign key(IdCodigoPostal) references CodigosPostales(IdCodigoPostal) on delete set default,
);



CREATE TABLE Direcciones (
    IdDireccion INT IDENTITY(1,1) NOT NULL,
    IdPais INT NOT NULL,
    IdEstado INT NOT NULL,
    IdMunicipio INT NOT NULL,
    IdColonia INT NOT NULL,
    IdCodigoPostal INT NOT NULL,
    Calle VARCHAR(255),
    CONSTRAINT PK_Direccion PRIMARY KEY(IdDireccion),
    CONSTRAINT FK_Pais_TO_Direccion FOREIGN KEY(IdPais) REFERENCES Paises(IdPais) ON DELETE NO ACTION,
    CONSTRAINT FK_Estado_TO_Direccion FOREIGN KEY(IdEstado) REFERENCES Estados(IdEstado) ON DELETE NO ACTION,
    CONSTRAINT FK_Municipio_TO_Direccion FOREIGN KEY(IdMunicipio) REFERENCES Municipios(IdMunicipio) ON DELETE NO ACTION,
    CONSTRAINT FK_Colonia_TO_Direccion FOREIGN KEY(IdColonia) REFERENCES Colonias(IdColonia) ON DELETE NO ACTION,
    CONSTRAINT FK_CP_TO_Direccion FOREIGN KEY(IdCodigoPostal) REFERENCES CodigosPostales(IdCodigoPostal) ON DELETE NO ACTION
);

CREATE TABLE Personas(
IdPersona int not null Identity,
Nombre varchar(80) not null,
CorreoElectronico varchar(50) not null unique,
Telefono varchar(15) not null unique,
IdDireccion int,
CONSTRAINT PK_Personas PRIMARY KEY(IdPersona),
CONSTRAINT FK_PersonasToDirecciones FOREIGN KEY(IdDireccion) REFERENCES Direcciones(IdDireccion) ON DELETE SET NULL
);

CREATE TABLE Roles(
IdRol int Identity not null,
Rol varchar(20) not null unique,
CONSTRAINT PK_Roles PRIMARY KEY(IdRol)
);

CREATE TABLE Sucursales(
IdSucursal int not null IDENTITY,
Nombre varchar(50) not null,
IdDireccion int,
CONSTRAINT PK_Sucursales PRIMARY KEY(IdSucursal),
CONSTRAINT FK_SucursalesToDirecciones FOREIGN KEY(IdDireccion) REFERENCES Direcciones(IdDireccion) ON DELETE SET NULL
);

CREATE TABLE Empleados(
IdEmpleado int not null Identity,
IdPersona int not null unique,
IdRol int not null,
Clave varchar(15) not null,
Sueldo money not null,
Estatus varchar(15) check(Estatus IN('Activo','Despedido','Ausente')),
Sucursal int not null,
CONSTRAINT PK_Empleados PRIMARY KEY (IdEmpleado),
CONSTRAINT FK_EmpleadosToRoles FOREIGN KEY(IdRol) REFERENCES Roles(IdRol) ON DELETE CASCADE,
CONSTRAINT FK_EmpleadosToPersonas FOREIGN KEY(IdPersona) REFERENCES Personas(IdPersona) ON DELETE CASCADE,
CONSTRAINT FK_EmpleadosToSucursales FOREIGN KEY(Sucursal) REFERENCES Sucursales(IdSucursal) ON DELETE CASCADE
);


CREATE TABLE Clientes(
IdCliente int not null IDENTITY,
IdPersona int not null unique,
CONSTRAINT PK_Clientes PRIMARY KEY(IdCliente),
CONSTRAINT FK_ClientesToPersonas FOREIGN KEY(IdPersona) REFERENCES Personas(IdPersona) on delete cascade
);

CREATE TABLE Proveedores(
IdProveedor int not null IDENTITY,
Proveedor varchar(100) not null,
Telefono varchar(20) not null,
IdDireccion int ,
CONSTRAINT PK_Proveedores PRIMARY KEY(IdProveedor),
CONSTRAINT FK_ProveedoresToDirecciones FOREIGN KEY(IdDireccion) REFERENCES Direcciones(IdDireccion) ON DELETE SET NULL
);

CREATE TABLE Categorias(
IdCategoria int not null IDENTITY,
Categoria varchar(75) not null,
CONSTRAINT PK_Categorias PRIMARY KEY(IdCategoria)
);

CREATE TABLE Productos (
IdProducto int not null IDENTITY,
Nombre varchar(75) not null,
IdCategoria int,
PrecioCompra money not null check(PrecioCompra>=0),
PrecioVenta money not null check(PrecioVenta>=0),
Stock int default 0 not null check(Stock>=0),
IdProveedor int,
CONSTRAINT PK_Productos PRIMARY KEY(IdProducto),
CONSTRAINT FK_ProductosToProveedores FOREIGN KEY(IdProveedor) references Proveedores(IdProveedor) ON DELETE CASCADE,
CONSTRAINT FK_ProductosToCategorias FOREIGN KEY(IdCategoria) references Categorias(IdCategoria) ON DELETE CASCADE
);

CREATE TABLE TempSessions(
IdEmpleado int not null,
Tabla varchar(50) not null
);

CREATE TABLE RegistroProductos(
IdRegistro int not null IDENTITY,
IdProducto int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroProductos PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroProductosToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

CREATE TABLE RegistroCategorias(
IdRegistro int not null IDENTITY,
IdCategoria int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroCategorias PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroCategoriasToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

CREATE TABLE RegistroProveedores(
IdRegistro int not null IDENTITY,
IdProveedor int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroProveedores PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroProveedoresToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

CREATE TABLE RegistroSucursales(
IdRegistro int not null IDENTITY,
IdSucursal int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroSucursales PRIMARY KEY(IdRegistro),
);

CREATE TABLE RegistroClientes(
IdRegistro int not null IDENTITY,
IdCliente int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroClientes PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroClientesToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

CREATE TABLE RegistroPersonas(
IdRegistro int not null IDENTITY,
IdPersona int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroPersonas PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroPersonasToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

CREATE TABLE RegistroEmpleados(
IdRegistro int not null IDENTITY,
IdEmpleado int not null,
Fecha date not null,
Accion varchar(25) not null,
Campo varchar(50) not null,
ValorAnterior varchar(100) not null,
ValorActual varchar(100) not null,
Empleado int not null,
CONSTRAINT PK_RegistroEmpleados PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroEmpleadosToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) on delete cascade
);

Create Table TempVentas(
IdEmpleado int not null,
Ticket int not null,
Cliente int not null
);

CREATE TABLE Ventas(
IdVenta int not null identity,
IdProducto int not null,
Cantidad int not null,
Precio int not null,
Ticket int not null,
Monto money not null,
CONSTRAINT PK_Ventas PRIMARY KEY(IdVenta),
CONSTRAINT FK_VentasToProductos FOREIGN KEY(IdProducto) REFERENCES Productos(IdProducto) on delete cascade
);

CREATE TABLE Tickets(
Ticket int not null identity,
Cantidad smallint not null,
Total money not null check(Total>=0),
Fecha date not null,
IdCliente int foreign key references Clientes(IdCliente) on delete cascade,
Sucursal int,
Empleado int,
NumTicket int,
CONSTRAINT PK_Tickets PRIMARY KEY(Ticket),
CONSTRAINT FK_TicketsToClientes FOREIGN KEY(IdCliente) REFERENCES Clientes(IdCliente) on DELETE NO ACTION,
CONSTRAINT FK_TicketsToSucursales FOREIGN KEY(Sucursal) REFERENCES Sucursales(IdSucursal) ON DELETE NO ACTION,
CONSTRAINT FK_TicketsToEmpleados FOREIGN KEY(Empleado) REFERENCES Empleados(IdEmpleado) ON DELETE NO ACTION
);


---------------------------------------CCODIGOS POSTALES-----------------------
insert into Paises values('Mexico');
insert into Estados select distinct d_estado, 1 from Guanajuato$ where d_estado is not null;
insert into Municipios (nombreMunicipio,idEstado)  select DISTINCT G.D_mnpio, E.idEstado   from Guanajuato$ as G inner join Estados as E on G.d_estado = E.nombreEstado ;
insert into CodigosPostales (codigoPostal,idMunicipio) select DISTINCT G.d_codigo, M.idMunicipio from Guanajuato$ as G inner join Municipios as M on G.D_mnpio = M.nombreMunicipio;
insert into Colonias (nombreColonia, idCodigoPostal) select DISTINCT G.d_asenta, CP.idCodigoPostal from Guanajuato$ as G inner join CodigosPostales as CP on G.d_codigo = CP.CodigoPostal;
---------------------------------------SECUENCIAS-----------------------
CREATE SEQUENCE NumTicket
    START WITH 1
    INCREMENT BY 1;
---------------------------------------FUNCIONES-----------------------
GO
CREATE OR ALTER function ObtenerDireccion(@Id int)
 returns varchar(100)
 as
 begin
	DECLARE @CodigoPost int, @Direccion varchar(100)
	SET @CodigoPost = (SELECT C.CodigoPostal FROM Direcciones AS D INNER JOIN CodigosPostales AS C ON D.IdCodigoPostal = C.IdCodigoPostal WHERE D.IdDireccion = @Id);
	SET @Direccion =  (SELECT CONCAT(D.Calle,' COL: ',C.NombreColonia, ' C.P: ', CP.CodigoPostal, ' ', M.NombreMunicipio, ' ', E.nombreEstado) FROM DIrecciones AS D
	INNER JOIN Colonias AS C ON D.IdColonia = C.IdColonia INNER JOIN CodigosPostales AS CP ON CP.IdCodigoPostal = D.IdCodigoPostal 
	INNER JOIN Municipios AS M ON M.IdMunicipio = D.IdMunicipio INNER JOIN Estados AS E ON E.IdEstado = D.IdEstado WHERE CP.CodigoPostal = @CodigoPost AND D.IdDireccion = @Id);

	Return @Direccion
end
go

CREATE OR ALTER function ObtenerTicket()
 returns int
 as
 begin
	declare @ID int;
	set @ID = (SELECT IDENT_CURRENT('Tickets')+1);
	return @ID;
end
go

GO

CREATE OR ALTER FUNCTION validarEmpleado(@Id int,@Clave varchar(15))
RETURNS VARCHAR(25)
AS
BEGIN
	DECLARE @Valor varchar(20), @ClaveBase varchar(15);
	SET @Valor = (select P.Nombre from Empleados as E INNER JOIN Personas as P ON E.IdPersona = P.IdPersona where E.IdEmpleado = @Id)
	IF @Valor IS NULL
	BEGIN
	Return 'NotFound'
	END
	ELSE
	BEGIN
		SET @ClaveBase = (SELECT Clave FROM Empleados where IdEmpleado = @Id);
		IF @ClaveBase = @Clave
		BEGIN
		Return 'Correct'
		END
		ELSE
		BEGIN
		Return 'Incorrect'
		END
	END
	return 'Proceso fallido'
END
GO
---------------------------------------VISTAS-----------------------
GO 
CREATE OR ALTER VIEW Perfil
AS
Select E.IdEmpleado as Empleado, P.Nombre as Nombre,R.Rol,E.Sueldo, P.CorreoElectronico as Correo, P.Telefono, E.Estatus, S.Nombre as Sucursal from Empleados as E INNER JOIN Personas as P on E.IdPersona = P.IdPersona INNER JOIN Roles as R ON E.IdRol = R.IdRol INNER JOIN Sucursales as S ON E.Sucursal = S.IdSucursal
Go

CREATE OR ALTER VIEW EmpleadoCrear
AS
SELECT IdPersona, IdRol as Rol, Clave,Sueldo,Estatus, Sucursal FROM Empleados
GO

CREATE OR ALTER VIEW PersonasVista
AS
SELECT IdPersona, Nombre, CorreoElectronico as Correo, Telefono, IdDireccion AS Direccion FROM Personas
GO

CREATE OR ALTER VIEW VistaDirecciones
AS
SELECT D.IdDireccion,P.NombrePais as Pais,  CP.CodigoPostal,E.NombreEstado as Estado, M.NombreMunicipio as Municipio, C.NombreColonia as Colonia,D.Calle FROM Direcciones as D INNER JOIN Paises as P ON D.IdPais = P.IdPais INNER JOIN Estados as E ON E.IdEstado = D.IdEstado INNER JOIN Municipios as M ON M.IdMunicipio = D.IdMunicipio INNER JOIN Colonias as C ON C.IdColonia = D.IdColonia INNER JOIN CodigosPostales as CP ON CP.IdCodigoPostal = D.IdCodigoPostal;
GO

CREATE OR ALTER VIEW VistaSucursales
AS
SELECT S.IdSucursal, S.Nombre, S.IdDireccion,COUNT(E.IdEmpleado) as CantidadEmpleados,  AVG(E.Sueldo) as AvgSueldo, MAX(E.Sueldo) AS SueldoMax FROM Sucursales as S LEFT JOIN Empleados as E ON S.IdSucursal = E.Sucursal GROUP BY S.IdSucursal, S.Nombre, S.IdDireccion
GO

CREATE OR ALTER VIEW VistaCategorias
AS
SELECT C.IdCategoria, C.Categoria,COUNT(P.IdCategoria) as CantidadProductos,  AVG(P.PrecioVenta) as AvgPrecio, MAX(P.PrecioVenta) AS PrecioMax FROM Productos as P RIGHT JOIN Categorias as C ON P.IdCategoria = C.IdCategoria GROUP BY C.IdCategoria, C.Categoria
GO

CREATE OR ALTER VIEW VistaProveedores
AS
SELECT Pr.IdProveedor, Pr.Proveedor,Pr.Telefono,Pr.IdDireccion, COUNT(P.IdProveedor) as CantidadProductos,  AVG(P.PrecioVenta) as AvgPrecio, MAX(P.PrecioVenta) AS PrecioMax FROM Productos as P RIGHT JOIN Proveedores as Pr ON P.IdProveedor = Pr.IdProveedor GROUP BY Pr.IdProveedor, Pr.Proveedor, Pr.IdDireccion,Pr.Telefono, Pr.IdDireccion
GO

CREATE OR ALTER VIEW VistaProductos
AS
SELECT P.IdProducto, P.Nombre, C.Categoria, P.PrecioCompra, P.PrecioVenta, P.Stock, Pr.Proveedor FROM Productos AS P LEFT JOIN Categorias AS C ON P.IdCategoria = C.IdCategoria INNER JOIN Proveedores as Pr ON P.IdProveedor = Pr.IdProveedor
GO

CREATE OR ALTER VIEW VistaClientes
AS
SELECT C.IdCliente, P.Nombre, P.CorreoElectronico as Correo, P.Telefono, P.IdDireccion as Direccion  FROM Clientes as C INNER JOIN Personas as P ON C.IdPersona = P.IdPersona
GO

CREATE OR ALTER VIEW VistaPersonasParaClientes
AS
SELECT C.IdCliente, P.Nombre, P.CorreoElectronico as Correo, P.Telefono, P.IdDireccion as Direccion  FROM Personas as P INNER JOIN Clientes as C ON P.IdPersona = C.IdPersona
GO

CREATE OR ALTER VIEW VistaClientesCompras
AS
SELECT T.IdCliente, COUNT(T.IdCliente) as Compras, SUM(T.Total) as Total FROM Ventas as V INNER JOIN Tickets as T ON V.Ticket = T.Ticket INNER JOIN Clientes as C ON T.IdCliente = C.IdCliente GROUP BY T.IdCliente
GO

CREATE OR ALTER VIEW vistaTicket
as
	select v.IdVenta ,p.Nombre as Producto, v.Cantidad, v.Precio,v.Monto  from Ventas as v INNER JOIN Productos as p ON v.IdProducto = p.IdProducto
go

CREATE OR ALTER VIEW VistaRegistroProductos
AS
	SELECT IdRegistro, IdProducto AS Elemento, Fecha, Accion, Campo, ValorAnterior, ValorActual, Empleado FROM RegistroProductos
GO
---------------------------------------STOCK PROCEDURE-----------------------
GO

CREATE OR ALTER PROCEDURE SP_CodigoPostal(@CP int)
AS
BEGIN
select P.NombrePais as Pais, E.nombreEstado as Estado, M.NombreMunicipio as Municipio, C.IdColonia as Id,C.NombreColonia as Elemento, CP.CodigoPostal as CP from Paises as P inner join Estados as E on P.IdPais = E.IdPais
inner join Municipios as M on E.IdEstado = M.IdEstado
inner join CodigosPostales as CP on M.IdMunicipio = CP.IdMunicipio
inner join Colonias as C on CP.IdCodigoPostal = C.IdCodigoPostal
where CP.CodigoPostal = @CP;
END
GO

CREATE OR ALTER PROCEDURE SP_InsertDireccion(@Pais int, @Estado int, @Municipio int, @Colonia int, @CodigoPostal int, @Calle varchar(100))
AS
BEGIN
	INSERT INTO Direcciones Values (@Pais,@Estado,@Municipio,@Colonia,@CodigoPostal,@Calle)
	SELECT IDENT_CURRENT('Direcciones') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_InsertPersonas(@Nombre varchar(20), @Correo varchar(25), @Telefono varchar(15), @Direccion int)
AS
BEGIN
	INSERT INTO Personas VALUES (@Nombre,@Correo,@Telefono,@Direccion)
	SELECT IDENT_CURRENT('Personas') as Id;
END
Go

CREATE OR ALTER PROCEDURE SP_InsertRoles(@Rol varchar(20))
AS
BEGIN
	Insert into Roles Values(@Rol)
END
GO

CREATE OR ALTER PROCEDURE SP_InsertSucursal(@Nombre varchar(50), @Direccion int)
AS
BEGIN
	INSERT INTO Sucursales VALUES (@Nombre, @Direccion)
	SELECT IDENT_CURRENT('Sucursales') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_InsertEmpleados(@IdPersona int,@Rol int,@Clave varchar(15), @Sueldo money, @Estatus varchar(15), @Sucursal int)
AS
BEGIN
	INSERT INTO Empleados VALUES (@IdPersona,@Rol,@Clave,@Sueldo,@Estatus,@Sucursal)
	SELECT IDENT_CURRENT('Empleados') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_MostrarDireccion(@Id int)
AS
BEGIN
	
	SELECT * from VistaDirecciones WHERE IdDireccion = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_MostrarDirecciones
AS
BEGIN
	
	SELECT * from VistaDirecciones
END
GO

--Login
CREATE OR ALTER PROCEDURE SP_ValidarEmpleado(@Id int, @Clave varchar(15))
AS
BEGIN
	DECLARE @IdEmpleado int,@Rol int, @Estatus varchar(20);
	SET @IdEmpleado = (select IdEmpleado from Empleados where IdEmpleado = @Id)
	SET @Rol = (SELECT IdRol from Empleados where IdEmpleado = @ID)
	SET @Estatus = (SELECT Estatus FROM Empleados WHERE IdEmpleado = @Id)
	select dbo.validarEmpleado(@Id,@Clave) as 'Respuesta', @IdEmpleado as Empleado,@Rol as Rol, @Estatus as Estatus
END
GO

-- Perfil
CREATE OR ALTER PROCEDURE SP_Perfil(@Id int)
AS
BEGIN
	SELECT * FROM Perfil where Empleado = @ID
END
GO

CREATE OR ALTER PROCEDURE SP_EditarPerfil(@Id int,@Correo varchar(25),@Telefono varchar(15))
AS
BEGIN
	Declare @IdPersona int;
	SET @IdPersona = (SELECT IdPersona from Empleados WHERE IdEmpleado = @Id);
	UPDATE Personas set CorreoElectronico = @Correo, Telefono = @Telefono where IdPersona = @IdPersona
	select * from Personas where IdPersona = @IdPersona
END
GO

--Empleados
CREATE OR ALTER PROCEDURE SP_EmpleadosVista
AS
BEGIN
	SELECT * FROM Perfil
END
GO

CREATE OR ALTER PROCEDURE SP_EmpleadosVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM Perfil WHERE Empleado = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_EmpleadosVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM Perfil WHERE Nombre Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_Columnas(@Tabla varchar(25))
AS
BEGIN
	SELECT COLUMN_NAME as Columnas FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @Tabla;
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerRoles
AS
BEGIN
	SELECT IdRol as Id, Rol as Elemento from Roles
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerSucursales
AS
BEGIN
	SELECT IdSucursal AS Id, Nombre as Elemento FROM Sucursales
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerDirecciones
AS
BEGIN
	SELECT IdDireccion AS Id, CONCAT('ID: ',IdDireccion,' Calle: ',Calle) AS Elemento FROM VistaDirecciones
END
GO

CREATE OR ALTER PROCEDURE SP_AlterEmpleado(@Id int, @Nombre varchar(30), @Rol int, @Sueldo money, @Correo varchar(50),@Telefono varchar(20), @Estatus varchar(20), @Sucursal int)
AS
BEGIN
BEGIN TRY
	BEGIN TRANSACTION
	UPDATE  P SET P.Nombre=@Nombre, P.CorreoElectronico = @Correo, P.Telefono = @Telefono from Personas as P INNER JOIN Empleados as E ON E.IdPersona=P.IdPersona WHERE E.IdEmpleado = @Id;
	UPDATE Empleados SET IdRol=@Rol, Sueldo = @Sueldo, Estatus = @Estatus, Sucursal = @Sucursal where IdEmpleado = @Id;
	SELECT IDENT_CURRENT('Empleados') as Id;
	COMMIT
END TRY
BEGIN CATCH
	ROLLBACK TRANSACTION
END CATCH
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteEmpleado(@Id int)
AS
BEGIN
 DELETE Empleados Where IdEmpleado = @Id
END
GO
--Personas
CREATE OR ALTER PROCEDURE SP_PersonasVista
AS
BEGIN
 SELECT * FROM PersonasVista
END
GO
CREATE OR ALTER PROCEDURE SP_PersonasVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM PersonasVista WHERE IdPersona = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_PersonasVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM PersonasVista WHERE Nombre Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_UdatePersona(@Id int, @Nombre varchar(30), @Correo varchar(50),@Telefono varchar(20), @Direccion int)
AS
BEGIN
UPDATE Personas SET Nombre=@Nombre, CorreoElectronico=@Correo,Telefono = @Telefono, IdDireccion = @Direccion where IdPersona=@Id;
SELECT IDENT_CURRENT('Personas') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_DeletePersona(@Id int)
AS
BEGIN
 DELETE Personas Where IdPersona = @Id
END
GO

-- Direcciones

CREATE OR ALTER PROCEDURE SP_AgregarDireccion(@Codigo int, @Colonia int, @Calle varchar(100))
AS
BEGIN
	Declare @IdCodigo int, @IdPais int, @IdEstado int, @IdMunicipio int;
	SET @IdCodigo = (SELECT IdCodigoPostal FROM CodigosPostales WHERE CodigoPostal = @Codigo);
	SET @IdMunicipio = (SELECT IdMunicipio FROM CodigosPostales WHERE IdCodigoPostal = @IdCodigo);
	SET @IdEstado = (SELECT IdEstado FROM Municipios WHERE IdMunicipio = @IdMunicipio);
	SET @IdPais = (SELECT IdPais FROM Estados WHERE IdEstado = @IdEstado);

	INSERT INTO DIRECCIONES VALUES (@IdPais,@IdEstado,@IdMunicipio,@Colonia,@IdCodigo,@Calle);
	SELECT IDENT_CURRENT('Direcciones') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteDireccion (@Id int)
AS
BEGIN
 DELETE Direcciones Where IdDireccion = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_UdateDirecciones(@Id int , @Codigo int, @Colonia int, @Calle varchar(100))
AS
BEGIN
	Declare @IdCodigo int, @IdPais int, @IdEstado int, @IdMunicipio int;
	SET @IdCodigo = (SELECT IdCodigoPostal FROM CodigosPostales WHERE CodigoPostal = @Codigo);
	SET @IdMunicipio = (SELECT IdMunicipio FROM CodigosPostales WHERE IdCodigoPostal = @IdCodigo);
	SET @IdEstado = (SELECT IdEstado FROM Municipios WHERE IdMunicipio = @IdMunicipio);
	SET @IdPais = (SELECT IdPais FROM Estados WHERE IdEstado = @IdEstado);

	UPDATE DIRECCIONES SET IdPais = @IdPais,IdEstado = @IdEstado, IdMunicipio = @IdMunicipio, IdColonia = @Colonia, IdCodigoPostal = @IdCodigo, Calle = @Calle where IdDireccion=@Id;
	SELECT IDENT_CURRENT('Direcciones') as Id;
END
GO

-- Sucursales

CREATE OR ALTER PROCEDURE SP_SucursalesVista
AS
BEGIN
 SELECT * FROM VistaSucursales
END
GO

CREATE OR ALTER PROCEDURE SP_DireccionesVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM VistaSucursales WHERE IdSucursal = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_DireccionesVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM VistaSucursales WHERE Nombre Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteSucursal(@Id int)
AS
BEGIN
 DELETE Sucursales Where IdSucursal= @Id
END
GO

CREATE OR ALTER PROCEDURE SP_UdateSucursal(@Id int, @Nombre varchar(30),@Direccion int)
AS
BEGIN
UPDATE Sucursales SET Nombre=@Nombre, IdDireccion = @Direccion where IdSucursal=@Id;
SELECT IDENT_CURRENT('Sucursales') as Id;
END
GO

-- Categorias
CREATE OR ALTER PROCEDURE sp_insertCategoria(
    @categoria varchar(50)
)
AS
BEGIN
    INSERT into Categorias VALUES (@categoria);
	SELECT IDENT_CURRENT('Categorias') as Id;

END
GO

CREATE OR ALTER PROCEDURE SP_CategoriasVista
AS
BEGIN
 SELECT * FROM VistaCategorias
END
GO

CREATE OR ALTER PROCEDURE SP_CategoriasVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM VistaCategorias WHERE IdCategoria = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_CategoriasVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM VistaCategorias WHERE Categoria Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteCategoria (@Id int)
AS
BEGIN
 DELETE Categorias Where IdCategoria = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_UpdateCategoria(@Id int, @Categoria varchar(30))
AS
BEGIN
UPDATE Categorias SET Categoria=@Categoria where IdCategoria=@Id;
SELECT IDENT_CURRENT('Categorias') as Id;
END
GO

-- Proveedores

CREATE OR ALTER PROCEDURE sp_insertProveedor(
    @proveedor varchar(50),
    @telefono varchar(10), @direccion int
)
AS
BEGIN
    INSERT into Proveedores VALUES(@proveedor,@telefono,@direccion)
	SELECT IDENT_CURRENT('Proveedores') as Id;

END
GO

CREATE OR ALTER PROCEDURE SP_ProveedoresVista
AS
BEGIN
 SELECT * FROM VistaProveedores
END
GO

CREATE OR ALTER PROCEDURE SP_ProveedoresVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM VistaProveedores WHERE IdProveedor = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ProveedoresVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM VistaProveedores WHERE Proveedor Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteProveedor (@Id int)
AS
BEGIN
 DELETE Proveedores Where IdProveedor = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_UpdateProveedor(@Id int, @Proveedor varchar(30), @Telefono varchar(12),@IdDireccion int)
AS
BEGIN
UPDATE Proveedores SET Proveedor=@Proveedor, Telefono =  @Telefono, IdDireccion = @IdDireccion  where IdProveedor=@Id;
SELECT IDENT_CURRENT('Proveedores') as Id;
END
GO


-- Productos
GO
CREATE OR ALTER PROCEDURE  SP_InsertProductos(
    @producto varchar(50),
    @idCategoria int,
	@precioCompra money,
    @precioVenta money,
    @stock int,
	@idProveedor int
)
AS
BEGIN
    INSERT into Productos VALUES(@producto,@idCategoria,@precioCompra,@precioVenta,@stock,@idProveedor)
	SELECT IDENT_CURRENT('Productos') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_ProductosVista
AS
BEGIN
 SELECT * FROM VistaProductos
 END
GO

CREATE OR ALTER PROCEDURE SP_ProductosVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM VistaProductos WHERE IdProducto = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ProductosVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM VistaProductos WHERE Nombre Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_ProductosVistaPorCategoria(@Id int)
AS
BEGIN
SELECT P.IdProducto, P.Nombre, C.Categoria, C.IdCategoria, P.PrecioCompra, P.PrecioVenta, P.Stock, Pr.Proveedor FROM Productos AS P LEFT JOIN Categorias AS C ON P.IdCategoria = C.IdCategoria INNER JOIN Proveedores as Pr ON P.IdProveedor = Pr.IdProveedor where C.IdCategoria  = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ProductosVistaPorProveedor(@Id int)
AS
BEGIN
SELECT P.IdProducto, P.Nombre, C.Categoria, C.IdCategoria, P.PrecioCompra, P.PrecioVenta, P.Stock, Pr.Proveedor, Pr.IdProveedor FROM Productos AS P LEFT JOIN Categorias AS C ON P.IdCategoria = C.IdCategoria INNER JOIN Proveedores as Pr ON P.IdProveedor = Pr.IdProveedor where Pr.IdProveedor  = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteProducto (@Id int)
AS
BEGIN
 DELETE Productos Where IdProducto = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_UpdateProducto(@Id int, @Nombre varchar(30), @IdCategoria int,@PrecioCompra money, @PrecioVenta money, @Stock int, @IdProveedor int)
AS
BEGIN
UPDATE Productos SET Nombre=@Nombre, IdCategoria =  @IdCategoria, PrecioCompra = @PrecioCompra, PrecioVenta = @PrecioVenta, Stock = @Stock, IdProveedor = @IdProveedor  where IdProducto=@Id;
SELECT IDENT_CURRENT('Productos') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerCategorias
AS
BEGIN
	SELECT IdCategoria Id, Categoria as Elemento from Categorias
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerProveedores
AS
BEGIN
	SELECT IdProveedor Id, Proveedor as Elemento from Proveedores
END
GO

-- Clientes
CREATE OR ALTER PROCEDURE SP_InsertClientes(@idPersona INT)
AS
BEGIN
    INSERT into Clientes VALUES(@idPersona)
END
GO

CREATE OR ALTER PROCEDURE SP_ClientesVista
AS
BEGIN
 SELECT * FROM VistaClientes;
 END
GO

CREATE OR ALTER PROCEDURE SP_ClientesVistaPorID(@Id int)
AS
BEGIN
	SELECT * FROM VistaClientes WHERE IdCliente = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ClientesVistaPorNombre(@Nombre varchar(50))
AS
BEGIN
	SELECT * FROM VistaClientes WHERE Nombre Like '%'+@Nombre+'%'
END
GO

CREATE OR ALTER PROCEDURE SP_AgregarClientesPag(@Nombre varchar(50), @correo varchar(50), @Telefono varchar(15), @Direccion int)
AS
BEGIN
	INSERT INTO Personas VALUES(@Nombre,@Correo,@Telefono,@Direccion);
	INSERT INTO Clientes VALUES(IDENT_CURRENT('Personas'));
	SELECT IDENT_CURRENT('Clientes') as Id;
END
GO

CREATE OR ALTER PROCEDURE SP_AlterCliente(@Id int, @Nombre varchar(30),@Correo varchar(50),@Telefono varchar(20), @Direccion int)
AS
BEGIN
BEGIN TRY
	BEGIN TRANSACTION
	UPDATE  P SET P.Nombre=@Nombre, P.CorreoElectronico = @Correo, P.Telefono = @Telefono, P.IdDireccion = @Direccion from Personas as P INNER JOIN Clientes as C ON C.IdPersona=P.IdPersona WHERE C.IdCliente = @Id;
	SELECT IDENT_CURRENT('Clientes') as Id;
	COMMIT
END TRY
BEGIN CATCH
	ROLLBACK TRANSACTION
END CATCH
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteCliente (@Id int)
AS
BEGIN
 DELETE Clientes Where IdCliente = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerPersonas
AS
BEGIN
SELECT IdPersona AS Id, CONCAT('ID: ',IdPersona, ' Nombre: ',Nombre) AS Elemento FROM Personas
END
GO

--Ventas

CREATE OR ALTER PROCEDURE SP_Ventas(
	@IdProducto int,
	@Cantidad smallint,
	@IdEmpleado int,
	@Cliente int
)
AS
BEGIN
	declare @Monto money, @Precio money;

	IF(SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado) IS NULL
	BEGIN
		INSERT INTO TempVentas VALUES(@IdEmpleado,(NEXT VALUE FOR NumTicket),@Cliente)
	END

	declare @NumTicket int
	set @Precio = (select PrecioVenta from Productos where IdProducto = @IdProducto)
	select @Monto = @Cantidad*@Precio;
	set @NumTicket = (SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado);
	insert into Ventas values (@IdProducto,@Cantidad,@Precio,@NumTicket,@Monto);

END
go

CREATE OR ALTER PROCEDURE SP_ObtenerClienteActual(@IdEmpleado int)
AS
BEGIN
	DECLARE @Res int;
	SET @Res = (SELECT Cliente FROM TempVentas WHERE IdEmpleado = @IdEmpleado)
	IF(@Res IS NULL)
	BEGIN
		SELECT 0 AS Cliente;
	END
	ELSE
	BEGIN
		SELECT @Res AS Cliente
	END
END
GO

CREATE OR ALTER PROCEDURE SP_Tickets (@IdEmpleado int)
as
begin
	
	declare @CantidadTotal int, @Total money, @Id int, @Sucursal int,@IdCliente int;

	SET @Sucursal = (SELECT Sucursal FROM Empleados WHERE IdEmpleado = @IdEmpleado);
	SET @IdCliente = (SELECT Cliente FROM Tempventas where IdEmpleado = @IdEmpleado);

	set @Id = (SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado);
	set @CantidadTotal = (select SUM(Cantidad) from Ventas where Ticket = @Id);
	set @Total = (select SUM(Monto) from Ventas where Ticket = @Id)
	insert into Tickets values (@CantidadTotal,@Total,GETDATE(),@IdCliente,@Sucursal,@IdEmpleado,@Id)
end;
go


CREATE OR ALTER PROCEDURE SP_TicketActualVista(@IdEmpleado int)
AS
BEGIN
	SELECT VT.IdVenta, VT.Producto, VT.Cantidad, VT.Precio, VT.Monto FROM vistaTicket AS VT INNER JOIN Ventas as V ON V.IdVenta = VT.IdVenta where Ticket = (SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado);
 END
GO

CREATE OR ALTER PROCEDURE SP_DeleteVenta(@Id int)
AS
BEGIN
 DELETE Ventas Where IdVenta = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerCliente(@Id int)
AS
BEGIN
 SELECT C.IdCliente ,P.Nombre FROM Clientes as C INNER JOIN Personas as P ON P.IdPersona = C.IdPersona WHERE C.IdCliente = @Id
 END
GO

CREATE OR ALTER PROCEDURE SP_ObtenerTotal(@IdEmpleado int)
AS
BEGIN
	SELECT SUM(Monto) as Total FROM Ventas WHERE Ticket = (SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado);
END
GO

CREATE OR ALTER PROCEDURE SP_ImprimirTicket(@IdEmpleado INT)
AS
BEGIN
	DECLARE @Id int;
	set @Id = (SELECT Ticket FROM Tempventas where IdEmpleado = @IdEmpleado);
	SELECT P.IdProducto, P.Nombre, V.Cantidad, V.Precio, V.Monto FROM VENTAS AS v INNER JOIN Productos as P ON P.IdProducto = V.IdProducto WHERE V.Ticket = @Id
	SELECT C.IdCliente, P.Nombre, T.Total, T.Fecha, T.NumTicket AS Ticket FROM Personas AS P INNER JOIN Clientes AS C ON C.IdPersona = P.IdPersona INNER JOIN Tickets AS T ON T.IdCliente = C.IdCliente WHERE T.NumTicket = @Id
	SELECT E.IdEmpleado, P.Nombre AS NombreEmpleado, S.Nombre as Sucursal, dbo.ObtenerDireccion(S.IdDireccion) AS Direccion FROM Empleados AS E INNER JOIN Personas AS  P ON E.IdPersona = P.IdPersona INNER JOIN Tickets AS T ON T.Empleado = E.IdEmpleado INNER JOIN Sucursales AS S ON S.IdSucursal = T.Sucursal WHERE T.NumTicket = @Id
	DELETE FROM TempVentas WHERE IdEmpleado = @IdEmpleado
END
GO
-- RegistroProductos
CREATE OR ALTER PROCEDURE SP_RegistroProductosVista
AS
BEGIN
 SELECT * FROM VistaRegistroProductos
 END
GO

---------------------------------------TRIGGERS-----------------------

--Ventas

CREATE TRIGGER TR_DeletedProductTicket
ON Ventas
FOR DELETE
AS
SET NOCOUNT ON;
DECLARE @IdProducto INT, @Cantidad INT
select @Cantidad = Cantidad from deleted;
select @IdProducto = IdProducto from deleted;
update Productos set Productos.Stock = Productos.Stock+@Cantidad where Productos.IdProducto = @IdProducto;
go

CREATE TRIGGER TR_UpdateInventarioProductos 
ON Ventas
FOR INSERT 
AS
SET NOCOUNT ON;
UPDATE Productos SET Productos.Stock=Productos.Stock-inserted.Cantidad FROM inserted
INNER JOIN Productos ON Productos.idProducto=inserted.idProducto
GO


CREATE OR ALTER PROCEDURE SP_Session(@ID int, @Tabla varchar(50))
AS
BEGIN
	DELETE TempSessions;
	INSERT INTO TempSessions VALUES (@ID,@Tabla)
	SELECT IdEmpleado as Empleado, Tabla FROM TempSessions
END
GO

CREATE OR ALTER TRIGGER TR_RegistroProductos
ON Productos
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT Nombre FROM INSERTED) != (SELECT Nombre FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','Nombre',D.Nombre, I.Nombre,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
			IF(SELECT IdCategoria FROM INSERTED) != (SELECT IdCategoria FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','IdCategoria',D.IdCategoria, I.IdCategoria,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
			IF(SELECT PrecioCompra FROM INSERTED) != (SELECT PrecioCompra FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','PrecioCompra',D.PrecioCompra, I.PrecioCompra,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
			IF(SELECT PrecioVenta FROM INSERTED) != (SELECT PrecioVenta FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','PrecioVenta',D.PrecioVenta, I.PrecioVenta,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
			IF(SELECT Stock FROM INSERTED) != (SELECT Stock FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','Stock',D.Stock, I.Stock,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
			IF(SELECT IdProveedor FROM INSERTED) != (SELECT IdProveedor FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT I.IdProducto, GETDATE(),'UPDATE','IdProveedor',D.IdProveedor, I.IdProveedor,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProducto = D.IdProducto
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroProductos SELECT IdProducto, GETDATE(),'INSERT','ALL','NE', Nombre,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroProductos SELECT IdProducto, GETDATE(), 'DELETE','ALL',Nombre,'NE',@Empleado FROM DELETED
			END
		END
		IF @Tabla = 'Productos'
		BEGIN
			DELETE TempSessions;
		END
	END
END
GO

CREATE OR ALTER TRIGGER TR_RegistroCategorias
ON Categorias
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT Categoria FROM INSERTED) != (SELECT Categoria FROM DELETED)
			BEGIN
				INSERT INTO RegistroCategorias SELECT I.IdCategoria, GETDATE(),'UPDATE','Categoria',D.Categoria, I.Categoria,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdCategoria = D.IdCategoria
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroCategorias SELECT IdCategoria, GETDATE(),'INSERT','ALL','NE', Categoria,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroCategorias SELECT IdCategoria, GETDATE(), 'DELETE','ALL',Categoria,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Categorias'
	BEGIN
		DELETE TempSessions;
	END
END
GO

CREATE OR ALTER TRIGGER TR_RegistroProveedores
ON Proveedores
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT Proveedor FROM INSERTED) != (SELECT Proveedor FROM DELETED)
			BEGIN
				INSERT INTO RegistroProveedores SELECT I.IdProveedor, GETDATE(),'UPDATE','Proveedor',D.Proveedor, I.Proveedor,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProveedor = D.IdProveedor
			END
			IF(SELECT Telefono FROM INSERTED) != (SELECT Telefono FROM DELETED)
			BEGIN
				INSERT INTO RegistroProveedores SELECT I.IdProveedor, GETDATE(),'UPDATE','Telefono',D.Telefono, I.Telefono,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProveedor = D.IdProveedor
			END
			IF(SELECT IdDireccion FROM INSERTED) != (SELECT IdDireccion FROM DELETED)
			BEGIN
				INSERT INTO RegistroProveedores SELECT I.IdProveedor, GETDATE(),'UPDATE','IdDireccion',D.IdDireccion, I.IdDireccion,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdProveedor = D.IdProveedor
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroProveedores SELECT IdProveedor, GETDATE(),'INSERT','ALL','NE', Proveedor,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroProveedores SELECT IdProveedor, GETDATE(), 'DELETE','ALL',Proveedor,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Proveedores'
	BEGIN
		DELETE TempSessions;
	END
END
GO


CREATE OR ALTER TRIGGER TR_RegistroSucursales
ON Sucursales
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT Nombre FROM INSERTED) != (SELECT Nombre FROM DELETED)
			BEGIN
				INSERT INTO RegistroSucursales SELECT I.IdSucursal, GETDATE(),'UPDATE','Nombre',D.Nombre, I.Nombre,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdSucursal = D.IdSucursal
			END
			IF(SELECT IdDireccion FROM INSERTED) != (SELECT IdDireccion FROM DELETED)
			BEGIN
				INSERT INTO RegistroSucursales SELECT I.IdSucursal, GETDATE(),'UPDATE','IdDireccion',D.IdDireccion, I.IdDireccion,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdSucursal = D.IdSucursal
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroSucursales SELECT IdSucursal, GETDATE(),'INSERT','ALL','NE', Nombre,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroSucursales SELECT IdSucursal, GETDATE(), 'DELETE','ALL',Nombre,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Sucursales'
	BEGIN
		DELETE TempSessions;
	END
END
GO

CREATE OR ALTER TRIGGER TR_RegistroClientes
ON Clientes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT IdPersona FROM INSERTED) != (SELECT IdPersona FROM DELETED)
			BEGIN
				INSERT INTO RegistroClientes SELECT I.IdCliente, GETDATE(),'UPDATE','IdPersona',D.IdPersona, I.IdPersona,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdCliente = D.IdCliente
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroClientes SELECT IdCliente, GETDATE(),'INSERT','ALL','NE', IdPersona,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroClientes SELECT IdCliente, GETDATE(), 'DELETE','ALL',IdPersona,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Clientes'
	BEGIN
		DELETE TempSessions;
	END
END
GO

CREATE OR ALTER TRIGGER TR_RegistroPersonas
ON Personas
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT Nombre FROM INSERTED) != (SELECT Nombre FROM DELETED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT I.IdPersona, GETDATE(),'UPDATE','Nombre',D.Nombre, I.Nombre,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdPersona = D.IdPersona
			END
			IF(SELECT CorreoElectronico FROM INSERTED) != (SELECT CorreoElectronico FROM DELETED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT I.IdPersona, GETDATE(),'UPDATE','CorreoElectronico',D.CorreoElectronico, I.CorreoElectronico,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdPersona = D.IdPersona
			END
			IF(SELECT Telefono FROM INSERTED) != (SELECT Telefono FROM DELETED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT I.IdPersona, GETDATE(),'UPDATE','Telefono',D.Telefono, I.Telefono,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdPersona = D.IdPersona
			END
			IF(SELECT IdDireccion FROM INSERTED) != (SELECT IdDireccion FROM DELETED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT I.IdPersona, GETDATE(),'UPDATE','IdDireccion',D.IdDireccion, I.IdDireccion,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdPersona = D.IdPersona
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT IdPersona, GETDATE(),'INSERT','ALL','NE', Nombre,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroPersonas SELECT IdPersona, GETDATE(), 'DELETE','ALL',Nombre,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Personas'
	BEGIN
		DELETE TempSessions;
	END
END
GO

CREATE OR ALTER TRIGGER TR_RegistroEmpleados
ON Empleados
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @Empleado INT, @Tabla varchar(50);
	SET @Empleado = (SELECT IdEmpleado FROM TempSessions);
	SET @Tabla = (SELECT Tabla FROM TempSessions);

	IF @Empleado IS NOT NULL
	BEGIN

		IF EXISTS (SELECT * FROM INSERTED) AND EXISTS (SELECT * FROM DELETED)
		BEGIN
			IF(SELECT IdPersona FROM INSERTED) != (SELECT IdPersona FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.IdPersona, I.IdPersona,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
			IF(SELECT IdRol FROM INSERTED) != (SELECT IdRol FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.IdRol, I.IdRol,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
			IF(SELECT Clave FROM INSERTED) != (SELECT Clave FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.Clave, I.Clave,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
			IF(SELECT Sueldo FROM INSERTED) != (SELECT Sueldo FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.Sueldo, I.Sueldo,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
			IF(SELECT Estatus FROM INSERTED) != (SELECT Estatus FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.Estatus, I.Estatus,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
			IF(SELECT Sucursal FROM INSERTED) != (SELECT Sucursal FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT I.IdEmpleado, GETDATE(),'UPDATE','Nombre',D.Sucursal, I.Sucursal,@Empleado FROM INSERTED AS I INNER JOIN DELETED AS D ON I.IdEmpleado = D.IdEmpleado
			END
		END
		ELSE
		BEGIN
			IF EXISTS (SELECT * FROM INSERTED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT IdEmpleado, GETDATE(),'INSERT','ALL','NE', IdEmpleado,@Empleado FROM INSERTED
			END

			 IF EXISTS (SELECT * FROM DELETED)
			BEGIN
				INSERT INTO RegistroEmpleados SELECT IdEmpleado, GETDATE(), 'DELETE','ALL',IdEmpleado,'NE',@Empleado FROM DELETED
			END
		END
	END
	IF @Tabla = 'Empleados'
	BEGIN
		DELETE TempSessions;
	END
END
GO
---

EXEC SP_InsertDireccion 1, 1, 20, 6487, 1276, 'Vallarta 78'
EXEC SP_InsertDireccion 1, 1, 15, 586, 350, 'Puebla 45'
EXEC SP_InsertDireccion 1, 1, 2, 8638, 1262, 'Satelite 25'
EXEC SP_InsertDireccion 1, 1, 20, 6487, 1276, 'Morelos 74'
EXEC SP_InsertDireccion 1, 1, 15, 586, 350, 'Aguascalientes 52'
EXEC SP_InsertDireccion 1, 1, 2, 8638, 1262, 'Guerrero 58'
EXEC SP_AgregarDireccion 37000, 844, 'Avenida Insurgentes 132'
EXEC SP_AgregarDireccion 36500,3510, 'Hidalgo 78'
EXEC SP_AgregarDireccion 38010, 149, 'La Piedra 58'
EXEC SP_AgregarDireccion 36000, 3302, 'Independencia 98'
EXEC SP_AgregarDireccion 36700, 8051, 'Pipila 53'
EXEC SP_AgregarDireccion 37000, 844, 'Avenida Las Flores 87'
EXEC SP_AgregarDireccion 36433, 1513, 'Avenida Los Castores 85'

EXEC SP_InsertSucursal 'Sucursal Morelos',4
EXEC SP_InsertSucursal 'Sucursal Aguascalientes',5
EXEC SP_InsertSucursal 'Sucursal Guerrero',6

EXEC SP_InsertPersonas 'Juan Pérez','juan@gmail.com','4454554575',1
EXEC SP_InsertPersonas 'Pedro Villa','pedro@gmail.com','45557454',2
EXEC SP_InsertPersonas 'Joaquin Piedra','joaquin@gmail.com','454545454',3
EXEC SP_InsertPersonas 'Sandra Mora','sandra@gmail.com','4268421873',1
EXEC SP_InsertPersonas 'Carlos Estrada','carlos@gmail.com','48675139746',3

EXEC SP_InsertClientes 4
EXEC SP_InsertClientes 5


EXEC SP_InsertRoles 'Gerente'
EXEC SP_InsertRoles 'Operador'

EXEC SP_InsertEmpleados 1,2,'Password123', 2000, 'Activo',1
EXEC SP_InsertEmpleados 2,1,'Password321',4000,'Activo',2
EXEC SP_InsertEmpleados 3,1,'',4000,'Activo',3

EXEC sp_insertCategoria 'Tarjetas de video'
EXEC sp_insertCategoria 'Tarjetas Madre'
EXEC sp_insertCategoria 'Procesadores'
EXEC sp_insertCategoria 'Memorias RAM'
EXEC sp_insertCategoria 'Almacenamiento'
EXEC sp_insertCategoria 'Accesorios'

EXEC sp_insertProveedor 'NVIDIA', '4859641235', 7
EXEC sp_insertProveedor 'ASUS', '4631287543',8
EXEC sp_insertProveedor 'Intel','4879641576',9
EXEC sp_insertProveedor 'Kingston', '4879674216',10
EXEC sp_insertProveedor 'Razer', '4268746972',11
EXEC sp_insertProveedor 'AMD', '4875219684',12
EXEC sp_insertProveedor 'Corsair', '4526971237', 13

EXEC SP_InsertProductos 'NVIDIA GeForce RTX 4090', 1, 35000, 42000, 15, 1
EXEC SP_InsertProductos 'NVIDIA GeForce RTX 3070', 1, 22000, 26400, 30, 1
EXEC SP_InsertProductos 'NVIDIA GeForce RTX 3060', 1, 15000, 18000, 40, 1
EXEC SP_InsertProductos 'AMD Radeon RX 7900 XTX0', 1, 28000, 33600, 20,6
EXEC SP_InsertProductos 'ASUS ROG Crosshair VIII Hero', 2, 7000,8400,35,2
EXEC SP_InsertProductos 'ASUS Prime Z490-A',2, 4800, 5760, 45, 2
EXEC SP_InsertProductos 'Intel Core i9-13900K', 3, 12000, 14400, 25, 3
EXEC SP_InsertProductos 'Intel Core i7-13700K', 3, 9000, 10800, 30, 3
EXEC SP_InsertProductos 'AMD Ryzen 7 7840HS', 3, 8400, 9500, 22, 6
EXEC SP_InsertProductos 'Corsair Vengeance 16GB DDR4', 4, 1800, 2160, 80,7
EXEC SP_InsertProductos 'Corsair Dominator 32GB DDR4', 4, 5500, 6600, 70, 7
EXEC SP_InsertProductos 'Corsair Vengeance LPX 32GB DDR4', 4, 3600, 4320, 60,7
EXEC SP_InsertProductos 'Kingston A2000 1TB NVMe M.2 SSD', 5, 2200, 2640, 65, 4
EXEC SP_InsertProductos 'Kingston KC2500 1TB NVMe M.2 SSD', 5, 3000, 3600, 50, 4
EXEC SP_InsertProductos 'Kingston DataTraveler 100 G3 128GB USB', 5, 400, 480, 100, 4
EXEC SP_InsertProductos 'Razer BlackWidow Keyboard', 6, 3000, 3600, 40, 5
EXEC SP_InsertProductos 'Razer DeathAdder V2 Mouse', 6, 1500,1800, 60,5

select * From RegistroProductos
select * From RegistroEmpleados
select * From Empleados

select * From Guanajuato$ where d_asenta = 'San Javier'

select * From Guanajuato$ where d_codigo = 36813

select * from CodigosPostales where CodigoPostal = 38800

select * From Guanajuato$  

select P.IdPais as Pais, E.IdEstado as Estado, M.IdMunicipio as Municipio, C.IdColonia as Colonia, CP.IdCodigoPostal as CP from Paises as P inner join Estados as E on P.IdPais = E.IdPais
inner join Municipios as M on E.IdEstado = M.IdEstado
inner join CodigosPostales as CP on M.IdMunicipio = CP.IdMunicipio
inner join Colonias as C on CP.IdCodigoPostal = C.IdCodigoPostal
where CP.CodigoPostal = 36433;

EXEC SP_Columnas 'Productos'