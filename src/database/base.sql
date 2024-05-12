CREATE DATABASE Inventario;
GO
USE Inventario;
GO

---------------------------------------TABLAS-----------------------

CREATE TABLE Personas(
IdPersona int not null Identity,
Nombre varchar(20) not null,
Apellidos varchar(30) not null,
CorreoElectronico varchar(25) not null unique,
Telefono varchar(15) not null unique,
CONSTRAINT PK_Personas PRIMARY KEY(IdPersona)
);

CREATE TABLE Roles(
IdRol int Identity not null,
Rol varchar(20) not null unique,
CONSTRAINT PK_Roles PRIMARY KEY(IdRol)
);

CREATE TABLE Empleados(
IdEmpleado int not null Identity,
IdPersona int not null unique,
IdRol int not null,
Clave varchar(15) not null,
Sueldo money not null,
Estatus varchar(15) check(Estatus IN('Activo','Despedido','Ausente')),
CONSTRAINT PK_Empleados PRIMARY KEY (IdEmpleado),
CONSTRAINT FK_EmpleadosToRoles FOREIGN KEY(IdRol) REFERENCES Roles(IdRol) ON DELETE CASCADE,
CONSTRAINT FK_EmpleadosToPersonas FOREIGN KEY(IdPersona) REFERENCES Personas(IdPersona) ON DELETE CASCADE
);

CREATE TABLE Sesiones(
IdSesion int not null Identity,
IdEmpleado int not null,
CONSTRAINT PK_Sesiones PRIMARY KEY(IdSesion),
CONSTRAINT FK_SesionesToEmpleados FOREIGN KEY(IdEmpleado) REFERENCES Empleados(IdEmpleado) ON DELETE CASCADE
);

---------------------------------------FUNCIONES-----------------------
GO

CREATE OR ALTER FUNCTION validarEmpleado(@Id int,@Clave varchar(15))
RETURNS VARCHAR(25)
AS
BEGIN
	DECLARE @Valor varchar(20), @ClaveBase varchar(15);
	SET @Valor = (select P.Apellidos from Empleados as E INNER JOIN Personas as P ON E.IdPersona = P.IdPersona where E.IdEmpleado = @Id)
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

select dbo.validarEmpleado(2,'Password321') as 'Respuesta'

---------------------------------------STOCK PROCEDURE-----------------------
GO

CREATE PROCEDURE SP_InsertPersonas(@Nombre varchar(20), @Apellidos varchar(30), @Correo varchar(25), @Telefono varchar(15))
AS
BEGIN
	INSERT INTO Personas VALUES (@Nombre,@Apellidos,@Correo,@Telefono)
END
Go

CREATE PROCEDURE SP_InsertRoles(@Rol varchar(20))
AS
BEGIN
	Insert into Roles Values(@Rol)
END
GO

CREATE OR ALTER PROCEDURE SP_InsertEmpleados(@IdPersona int,@Rol int,@Clave varchar(15), @Sueldo money, @Estatus varchar(15))
AS
BEGIN
	INSERT INTO Empleados VALUES (@IdPersona,@Rol,@Clave,@Sueldo,@Estatus)
END
GO

CREATE OR ALTER PROCEDURE SP_ValidarEmpleado(@Id int, @Clave varchar(15))
AS
BEGIN
	DECLARE @Valor varchar(15)
	SET @Valor = (select CONCAT(P.NOmbre,' ',P.Apellidos) as Empleado from Empleados as E INNER JOIN Personas as P ON E.IdPersona = P.IdPersona where E.IdEmpleado = @Id)
	select dbo.validarEmpleado(@Id,@Clave) as 'Respuesta', @Valor as Empleado
END
GO

EXEC SP_InsertPersonas 'Juan', 'Pérez','juan@gmail.com','4454554575'
EXEC SP_InsertPersonas 'Pedro', 'Villa','pedro@gmail.com','45557454'

EXEC SP_InsertRoles 'Gerente'
EXEC SP_InsertRoles 'Operador'

EXEC SP_InsertEmpleados 1,2,'Password123', 2000, 'Activo'
EXEC SP_InsertEmpleados 2,1,'Password321',4000,'Activo'

EXEC SP_ValidarEmpleado 1,'Password123'
