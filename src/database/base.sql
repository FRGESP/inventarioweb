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
CONSTRAINT FK_ClientesToPersonas FOREIGN KEY(IdPersona) REFERENCES Personas(IdPersona)
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
IdCategoria int not null,
PrecioCompra money not null check(PrecioCompra>=0),
PrecioVenta money not null check(PrecioVenta>=0),
Stock int default 0 not null check(Stock>=0),
IdProveedor int not null,
CONSTRAINT PK_Productos PRIMARY KEY(IdProducto),
CONSTRAINT FK_ProductosToProveedores FOREIGN KEY(IdProveedor) references Proveedores(IdProveedor) on delete cascade
);

CREATE TABLE RegistroProductos(
IdRegistro int not null IDENTITY,
IdProducto int not null,
Fecha date not null,
Accion varchar(25) not null,
Usuario int not null,
CONSTRAINT PK_RegistroProductos PRIMARY KEY(IdRegistro),
CONSTRAINT FK_RegistroProductosToProductos FOREIGN KEY(IdProducto) REFERENCES Productos(IdProducto) on delete cascade,
);

CREATE TABLE RegistroPrecios(
IdRegistroPrecio int not null IDENTITY,
IdProducto int not null,
Fecha date not null,
Tipo varchar(50) not null,
Usuario int not null,
PrecioAnterior money not null,
PrecioActual money not null,
CONSTRAINT PK_RegistroPrecios PRIMARY KEY(IdRegistroPrecio),
CONSTRAINT FK_RegistroPreciosToProductos FOREIGN KEY(IdProducto) REFERENCES Productos(IdProducto) on delete cascade 
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
CONSTRAINT PK_Tickets PRIMARY KEY(Ticket),
CONSTRAINT FK_TicketsToClientes FOREIGN KEY(IdCliente) REFERENCES Clientes(IdCliente) on DELETE NO ACTION,
CONSTRAINT FK_TicketsToSucursales FOREIGN KEY(Sucursal) REFERENCES Sucursales(IdSucursal) ON DELETE NO ACTION
);
---------------------------------------CCODIGOS POSTALES-----------------------
insert into Paises values('Mexico');
insert into Estados select distinct d_estado, 1 from Guanajuato$ where d_estado is not null;
insert into Municipios (nombreMunicipio,idEstado)  select DISTINCT G.D_mnpio, E.idEstado   from Guanajuato$ as G inner join Estados as E on G.d_estado = E.nombreEstado ;
insert into CodigosPostales (codigoPostal,idMunicipio) select DISTINCT G.d_codigo, M.idMunicipio from Guanajuato$ as G inner join Municipios as M on G.D_mnpio = M.nombreMunicipio;
insert into Colonias (nombreColonia, idCodigoPostal) select DISTINCT G.d_asenta, CP.idCodigoPostal from Guanajuato$ as G inner join CodigosPostales as CP on G.d_codigo = CP.CodigoPostal;
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

select * from Categorias
---------------------------------------FUNCIONES-----------------------
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
	DECLARE @IdEmpleado int,@Rol int;
	SET @IdEmpleado = (select IdEmpleado from Empleados where IdEmpleado = @Id)
	SET @Rol = (SELECT IdRol from Empleados where IdEmpleado = @ID)
	select dbo.validarEmpleado(@Id,@Clave) as 'Respuesta', @IdEmpleado as Empleado,@Rol as Rol
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
select * from Proveedores

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
END
GO

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

select * From Categorias
select * From Proveedores
select * From Productos

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