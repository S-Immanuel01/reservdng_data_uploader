describe('RESERVDNG RESTAURANTS UPLOAD', { testIsolation: false }, () => {
  const url = 'https://docs.google.com/spreadsheets/d/1FmQj0-Mj8lXgoQlFfsX2aQG9rkn5Pk6EkB3HAUYj4hM/edit?gid=794979234#gid=794979234'

  const range = {
    'start': 10,
    'end': 10
  }

  let restaurants: Array<Record<string, any>> = []
  let token: string

  before(() => {
    cy.task<Array<{ name: string; data: any[][] }>>('readRemoteExcel', url).then((sheets) => {
      const restaurants_sheet = sheets[0]?.data ?? []

      restaurants = restaurants_sheet.slice(range.start + 1, range.end + 2).map((row) => ({
        name: row[2] ?? "The Bloom",
        cuisines: row[3] ? String(row[3]).split(',').map((a: string) => a.trim()) : ['African', 'Asian Fusion'],
        highlight: row[4],
        description: row[5],
        price_rating: row[6],
        dress_code: row[7],
        phone: row[8],
        email: row[9],
        website: row[10],
        instagram: row[11],
        address: row[12],
        city: row[13],
        state: row[14],
        landmarks: row[15],
        transportation: row[16] ? String(row[16]).split(',').map((a: string) => a.trim()) : ['airport-shuttle', 'taxi-service'],
        amenities: row[17] ? String(row[17]).split(',').map((a: string) => a.trim()) : ['outdoor', 'rooftop'],
        cancellation_highlight: row[18] ?? 'highlight',
        cancellation_policy: row[19] ?? 'policy',
        late_highlight: row[20] ?? 'late hightlight',
        late_policy: row[21] ?? 'late policy',
        guest_highlight: row[22] ?? 'guest hightlight',
        guest_policy: row[23] ?? 'guest policy'
      }))
    })

    cy.env<{ EMAIL?: string; PASSWORD?: string }>(['EMAIL', 'PASSWORD']).then(({ EMAIL, PASSWORD }) => {
      if (!EMAIL || !PASSWORD) {
        throw new Error('Missing EMAIL or PASSWORD in Cypress environment. Check the project .env file.');
      }

      return cy.loginWithEmailAndPassword(EMAIL, PASSWORD);
    });


  })

  it('UPLOADS ALL restaurants', () => {
    cy.wrap(restaurants).each((_restaurant: any) => {
      cy.visit('/restaurants/create')
      cy.get('input[name="_token"]').invoke('val').then((value) => {
        token = value?.toString() ?? ''
      })

      cy.getCookie('XSRF-TOKEN').then((xsrfCookie) => {
        cy.getCookie('reservdng_session').then((sessionCookie) => {
          const decodedToken = decodeURIComponent(xsrfCookie!.value)

          cy.task('multipartNestedRequest', {
            url: 'https://reservdng.com/restaurants',
            headers: {
              'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie!.value),
              'X-CSRF-TOKEN': token,
              'Cookie': `XSRF-TOKEN=${xsrfCookie!.value}; reservdng_session=${sessionCookie!.value}`,
            },
            fields: {
              name: _restaurant.name,
              cuisines: _restaurant.cuisines,
              highlight: _restaurant.highlight,
              description: _restaurant.description,
              price_rating: _restaurant.price_rating,
              dress_code: _restaurant.dress_code,
              phone: _restaurant.phone,
              email: _restaurant.email,
              website: _restaurant.website,
              instagram: _restaurant.instagram,
              address: _restaurant.address,
              city: _restaurant.city,
              state: _restaurant.state,
              landmarks: _restaurant.landmarks,
              transportation: _restaurant.transportation, //['airport-shuttle', 'taxi-service', 'public-transport', 'car-rental', 'self-parking', 'valet-parking']
              amenities: _restaurant.amenities, // ['outdoor', 'rooftop', 'private', 'lounge', 'valet', 'parking', 'wifi', 'bar', 'accessible', 'delivery', 'takeout', 'catering', 'ac', 'kids', 'music', 'live', 'cash', 'card', 'transfer']
              cancellation_highlight: _restaurant.cancellation_highlight,
              cancellation_policy: _restaurant.cancellation_policy,
              late_highlight: _restaurant.late_highlight,
              late_policy: _restaurant.late_policy,
              guest_highlight: _restaurant.guest_highlight,
              guest_policy: _restaurant.guest_policy,
              menus: {
                pdf: { id: 'pdf-1793189750109', name: 'Zinsser_WritingWell_Part1_LO2.pdf', size: 5402313, type: 'application/pdf', state: 'new' },
                images: [{ id: 'mimg-1793189762128siphn22a6s', name: 'signature.jpeg', size: 556877, type: 'image/jpeg', state: 'new' }],
              },
              specialties: [{ id: 'sp-1793189764530', name: 'asfds', description: 'srdhnsdf', price: 12434 }],
              seatings: [{ id: 'seat-1793189777430', name: 'dfsgnc', description: 'fsdgnhm', capacity: 1, price: 20000 }],
              hours: [
                { day: 'Monday', open: '09:00', close: '22:00', closed: 0 },
                { day: 'Tuesday', open: '09:00', close: '22:00', closed: 0 },
                { day: 'Wednesday', open: '09:00', close: '22:00', closed: 0 },
                { day: 'Thursday', open: '09:00', close: '22:00', closed: 0 },
                { day: 'Friday', open: '11:00', close: '23:00', closed: 0 },
                { day: 'Saturday', open: '11:00', close: '23:00', closed: 0 },
                { day: 'Sunday', open: '00:00', close: '00:00', closed: 0 },
              ],
              _token: token,
            },
            files: {
              'photos[0]': 'cypress/fixtures/restaurant.jpg',
              'menus[pdf][rawFile]': 'cypress/fixtures/menus/menu.pdf',
              'menus[images][0][url]': 'cypress/fixtures/menus/signature.jpeg',
              'specialties[0][image]': 'cypress/fixtures/Menus/special.jpg',
              'seatings[0][image]': 'cypress/fixtures/Menus/seatings.jpg',
            },
          }).then((res: any) => {
            cy.log(JSON.stringify(res.body, null, 2))
            console.log(res.body)
            // expect(res.status).to.be.oneOf([200, 201, 302])
          })

        })
      })

      cy.visit(`/restaurants/${_restaurant.name.toLowerCase().trim().replace(/\s+/g, '-')}`);

      cy.wait(5000)
    })
  })
})