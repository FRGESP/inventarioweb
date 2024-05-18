CREATE DATABASE Inventario;
GO
USE Inventario;
GO

---------------------------------------TABLAS-----------------------

CREATE TABLE Personas(
IdPersona int not null Identity,
Nombre varchar(80) not null,
CorreoElectronico varchar(50) not null unique,
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

---------------------------------------VISTAS-----------------------
GO
CREATE OR ALTER VIEW Perfil
AS
Select E.IdEmpleado as Empleado, P.Nombre as Nombre,R.Rol,E.Sueldo, P.CorreoElectronico as Correo, P.Telefono, E.Estatus from Empleados as E INNER JOIN Personas as P on E.IdPersona = P.IdPersona INNER JOIN Roles as R ON E.IdRol = R.IdRol
Go

CREATE OR ALTER VIEW EmpleadoCrear
AS
SELECT IdPersona, IdRol as Rol, Clave,Sueldo,Estatus FROM Empleados
GO
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

CREATE PROCEDURE SP_InsertPersonas(@Nombre varchar(20), @Correo varchar(25), @Telefono varchar(15))
AS
BEGIN
	INSERT INTO Personas VALUES (@Nombre,@Correo,@Telefono)
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

CREATE OR ALTER PROCEDURE SP_AlterEmpleado(@Id int, @Nombre varchar(30), @Rol int, @Sueldo money, @Correo varchar(50),@Telefono varchar(20), @Estatus varchar(20))
AS
BEGIN
UPDATE  P SET P.Nombre=@Nombre, P.CorreoElectronico = @Correo, P.Telefono = @Telefono from Personas as P INNER JOIN Empleados as E ON E.IdPersona=P.IdPersona WHERE E.IdEmpleado = @Id;
UPDATE Empleados SET IdRol=@Rol, Sueldo = @Sueldo, Estatus = @Estatus where IdEmpleado = @Id;
select * From Empleados WHERE IdEmpleado = @Id
END
GO

CREATE OR ALTER PROCEDURE SP_DeleteEmpleado(@Id int)
AS
BEGIN
 DELETE Empleados Where IdEmpleado = @Id
END
GO



EXEC SP_InsertPersonas 'Juan Pérez','juan@gmail.com','4454554575'
EXEC SP_InsertPersonas 'Pedro Villa','pedro@gmail.com','45557454'
EXEC SP_InsertPersonas 'Joaquin Piedra','joaquin@gmail.com','454545454'

EXEC SP_InsertRoles 'Gerente'
EXEC SP_InsertRoles 'Operador'

EXEC SP_InsertEmpleados 1,2,'Password123', 2000, 'Activo'
EXEC SP_InsertEmpleados 2,1,'Password321',4000,'Activo'
EXEC SP_InsertEmpleados 4,1,'',4000,'Activo'

EXEC SP_ValidarEmpleado 1,'Password123'

EXEC SP_EmpleadosVistaPorNombre 'J'

EXEC SP_ObtenerRoles
EXEC SP_AlterEmpleado 1,'Julian Mendoza', 1, 1000, 'Juliansitopa@gmail','4545474986','Activo'

EXEC SP_DeleteEmpleado 4

EXEC SP_Columnas 'EmpleadoCrear'

