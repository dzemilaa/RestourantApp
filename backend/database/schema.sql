IF DB_ID(N'BellaRestaurantDb') IS NULL
BEGIN
    CREATE DATABASE [BellaRestaurantDb];
END;
GO

USE [BellaRestaurantDb];
GO

IF OBJECT_ID(N'dbo.Registration', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Registration
    (
        ID int IDENTITY(1,1) NOT NULL,
        UserName varchar(100) NOT NULL,
        Password varchar(100) NOT NULL,
        Email varchar(100) NOT NULL,
        IsActive int NOT NULL CONSTRAINT DF_Registration_IsActive DEFAULT (0),
        IsVerified bit NOT NULL CONSTRAINT DF_Registration_IsVerified DEFAULT (0),
        CONSTRAINT PK_Registration PRIMARY KEY CLUSTERED (ID),
        CONSTRAINT UQ_Registration_UserName UNIQUE (UserName),
        CONSTRAINT UQ_Registration_Email UNIQUE (Email)
    );
END;
GO

IF OBJECT_ID(N'dbo.Product', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Product
    (
        ProductId int IDENTITY(1,1) NOT NULL,
        Name nvarchar(255) NOT NULL,
        Description nvarchar(1000) NULL,
        Price decimal(10,2) NOT NULL,
        Category nvarchar(255) NOT NULL,
        Image nvarchar(500) NULL,
        CONSTRAINT PK_Product PRIMARY KEY CLUSTERED (ProductId),
        CONSTRAINT CK_Product_Price_NonNegative CHECK (Price >= 0)
    );
END;
GO

IF OBJECT_ID(N'dbo.Carts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Carts
    (
        Id int IDENTITY(1,1) NOT NULL,
        UserId int NOT NULL,
        CONSTRAINT PK_Carts PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT UQ_Carts_UserId UNIQUE (UserId),
        CONSTRAINT FK_Carts_Registration FOREIGN KEY (UserId)
            REFERENCES dbo.Registration (ID) ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.CartItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CartItems
    (
        Id int IDENTITY(1,1) NOT NULL,
        CartId int NOT NULL,
        ProductId int NOT NULL,
        Quantity int NOT NULL CONSTRAINT DF_CartItems_Quantity DEFAULT (1),
        CONSTRAINT PK_CartItems PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT UQ_CartItems_Cart_Product UNIQUE (CartId, ProductId),
        CONSTRAINT CK_CartItems_Quantity_Positive CHECK (Quantity > 0),
        CONSTRAINT FK_CartItems_Carts FOREIGN KEY (CartId)
            REFERENCES dbo.Carts (Id) ON DELETE CASCADE,
        CONSTRAINT FK_CartItems_Product FOREIGN KEY (ProductId)
            REFERENCES dbo.Product (ProductId)
    );
END;
GO

IF OBJECT_ID(N'dbo.[Order]', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.[Order]
    (
        Id int IDENTITY(1,1) NOT NULL,
        UserId int NOT NULL,
        Address nvarchar(255) NOT NULL,
        TotalAmount decimal(18,2) NOT NULL,
        OrderDate datetime2(3) NOT NULL CONSTRAINT DF_Order_OrderDate DEFAULT (SYSUTCDATETIME()),
        Image nvarchar(500) NULL,
        Status nvarchar(50) NOT NULL CONSTRAINT DF_Order_Status DEFAULT (N'Pending'),
        FirstName nvarchar(100) NOT NULL,
        LastName nvarchar(100) NOT NULL,
        Email nvarchar(100) NOT NULL,
        Phone nvarchar(50) NOT NULL,
        CONSTRAINT PK_Order PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_Order_TotalAmount_NonNegative CHECK (TotalAmount >= 0),
        CONSTRAINT FK_Order_Registration FOREIGN KEY (UserId)
            REFERENCES dbo.Registration (ID)
    );
END;
GO

IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderItems
    (
        Id int IDENTITY(1,1) NOT NULL,
        OrderId int NOT NULL,
        ProductId int NOT NULL,
        Quantity int NOT NULL,
        Price decimal(18,2) NOT NULL,
        Image nvarchar(500) NULL,
        CONSTRAINT PK_OrderItems PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_OrderItems_Quantity_Positive CHECK (Quantity > 0),
        CONSTRAINT CK_OrderItems_Price_NonNegative CHECK (Price >= 0),
        CONSTRAINT FK_OrderItems_Order FOREIGN KEY (OrderId)
            REFERENCES dbo.[Order] (Id),
        CONSTRAINT FK_OrderItems_Product FOREIGN KEY (ProductId)
            REFERENCES dbo.Product (ProductId)
    );
END;
GO

IF OBJECT_ID(N'dbo.Reviews', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reviews
    (
        ReviewId int IDENTITY(1,1) NOT NULL,
        OrderId int NOT NULL,
        UserId int NOT NULL,
        ReviewText nvarchar(max) NOT NULL,
        CreatedAt datetime2(3) NOT NULL CONSTRAINT DF_Reviews_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_Reviews PRIMARY KEY CLUSTERED (ReviewId),
        CONSTRAINT FK_Reviews_Order FOREIGN KEY (OrderId)
            REFERENCES dbo.[Order] (Id),
        CONSTRAINT FK_Reviews_Registration FOREIGN KEY (UserId)
            REFERENCES dbo.Registration (ID)
    );
END;
GO

IF OBJECT_ID(N'dbo.ReviewProducts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ReviewProducts
    (
        ReviewId int NOT NULL,
        ProductId int NOT NULL,
        CONSTRAINT PK_ReviewProducts PRIMARY KEY CLUSTERED (ReviewId, ProductId),
        CONSTRAINT FK_ReviewProducts_Reviews FOREIGN KEY (ReviewId)
            REFERENCES dbo.Reviews (ReviewId),
        CONSTRAINT FK_ReviewProducts_Product FOREIGN KEY (ProductId)
            REFERENCES dbo.Product (ProductId)
    );
END;
GO
