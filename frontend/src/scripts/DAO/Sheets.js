class Sheets {

    static getOwnedSheets() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        name: "Sheet 1",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°1",
                        owner: "Test"
                    },
                    {
                        name: "Sheet 2",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°2",
                        owner: "Test3"
                    },
                    {
                        name: "Sheet 3",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°3",
                        owner: "Test"
                    },
                    {
                        name: "Sheet 4",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°4",
                        owner: "Test2"
                    },
                    {
                        name: "Sheet 5",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°5",
                        owner: "Test2"
                    },
                    {
                        name: "Sheet 6",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°6",
                        owner: "Test2"
                    },
                    {
                        name: "Sheet 7",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°7",
                        owner: "Test2"
                    },
                    {
                        name: "Sheet 8",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°8",
                        owner: "Test2"
                    },
                    {
                        name: "Sheet 9",
                        createdAt: "2023-11-20 00:39:50.434000 +00:00",
                        details: "Test Sheet N°9",
                        owner: "Test2"
                    }
                ])
            },
            1000)        // We return the object after 1 second.
        })
    }
}

export default Sheets