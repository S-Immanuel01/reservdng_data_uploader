describe('RESERVDNG HOTEL UPLOAD', () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=569941470#gid=569941470'

  const range = {
    'start': 10,
    'end': 10
  }

  let hotels: Array<Record<string, any>> = []

  before(() => {
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const sheet4 = sheets[0]?.data ?? []

      hotels = sheet4.slice(range.start + 1, range.end + 2).map((row) => ({
        name: row[2],
        rating: row[3],
        highlight: row[4],
        description: row[5],
        phone: row[6],
        email: row[7],
        website: row[8],
        instagram: row[9],
        address: row[10],
        city: row[11],
        state: row[12],
        landmarks: row[13],
        transportation: row[14] ? String(row[14]).split(',').map((t: string) => t.trim()) : [],
        roomName: row[15],
        numGuests: row[16],
        numRooms: row[17],
        ratePerNight: row[18],
        roomDescription: row[19],
        roomAmenities: row[20] ? String(row[20]).split(',').map((a: string) => a.trim()) : [],
        checkIn: row[21],
        checkOut: row[22],
        cancellationHighlight: row[23],
        cancellationPolicy: row[24],
        amenities: row[25] ? String(row[25]).split(',').map((a: string) => a.trim()) : [],
        paymentOptions: row[26] ? String(row[26]).split(',').map((p: string) => p.trim()) : [],
        specialFeatures: row[27]
      }))
    })

    cy.loginWithEmailAndPassword(Cypress.env('email'), Cypress.env('password'))
  })

  it('UPLOADS ALL HOTELS', () => {
    cy.wrap(hotels).each((_hotel: any) => {
      cy.visit('/')
      cy.get('span.rounded-full')
        .first()
        .click()
      cy.contains('New Location')
        .click()
      cy.get('[name="_token"]').invoke('attr', 'value')
        .then((_token) => {
          cy.request({
            method: "POST",
            url: "/drafts",
            body: {
              "_token": _token,
              "r_count": 2,
              "name": _hotel.name,
              "star_rating": _hotel.rating,
              "highlight": _hotel.highlight,
              "description": _hotel.description,
              "phone": _hotel.phone,
              "email": _hotel.email,
              "website": "",
              "instagram": _hotel.instagram ?? "",
              "address": _hotel.address,
              "city": _hotel.city,
              "state": _hotel.state,
              "landmarks": _hotel.landmarks,
              "transportation": _hotel.transportation.length ? _hotel.transportation : ["airport-shuttle", "taxi-service", "public-transport"],
              "room_1_name": _hotel.roomName,
              "room_1_guests": _hotel.numGuests ?? 1,
              "room_1_count": _hotel.numRooms ?? 100,
              "room_1_rate": _hotel.ratePerNight ?? 1000,
              "room_1_description": _hotel.roomDescription ?? "lovely",
              "room_1_amenities": _hotel.roomAmenities.length ? _hotel.roomAmenities : ["ac", "tv", "minibar", "safe", "balcony", "coffee-maker", "work-desk", "bathrobe"],
              "room_2_name": "",
              "room_2_guests": "",
              "room_2_count": "",
              "room_2_rate": "",
              "room_2_description": "",
              "checkin_time": _hotel.checkIn ?? "07:40",
              "checkout_time": _hotel.checkOut ?? "12:45",
              "cancellation_highlight": _hotel.cancellationHighlight ?? "No policy Stated",
              "cancellation_policy": _hotel.cancellationPolicy ?? "No policy Stated",
              "amenities": _hotel.amenities.length ? _hotel.amenities : ["wifi", "pool", "restaurant", "bar", "concierge"],
              "payment": _hotel.paymentOptions.length ? _hotel.paymentOptions : ["cash", "card", "transfer"],
              "special_features": _hotel.specialFeatures ?? "",
              "_method": "POST",
              "draft_type": "Add Hotel"
            }
          })
        })
      cy.wait(3000)

      cy.get('.grid.gap-8 .p-6')
        .first()
        .click()
      cy.contains('Continue')
        .click({ force: true })
      cy.get('[onclick="nextStep()"]')
        .click({ multiple: true, force: true })
      cy.get('#photos')
        .selectFile('cypress/fixtures/hotel.jpg', { force: true })
      cy.contains('Submit')
        .click()

      // cy.intercept('POST', '**/hotels/**').as('hotelSummary')

      // cy.wait('@hotelSummary', { timeout: 90000})

      cy.wait(10000)
    })
  })
})