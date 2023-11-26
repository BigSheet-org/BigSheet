class Sheets {

    static getOwnedSheets() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        name: "Sheet1",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°1"
                    },
                    {
                        name: "Sheet2",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°2"
                    },
                    {
                        name: "Sheet3",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°3"
                    },
                    {
                        name: "Sheet4",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°4"
                    }
                ])},
                1000)        // We return the object after 1 second.
        })
    }
}