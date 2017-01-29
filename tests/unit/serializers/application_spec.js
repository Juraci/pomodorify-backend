import ApplicationSerializer from '../../../src/serializers/application';

describe('Application serializer', () => {
  describe('#type', () => {
    it('returns the resource type', () => {
      const appSerializer = new ApplicationSerializer({ type: 'bands' });
      expect(appSerializer.type).to.be.equal('bands');
    });
  });

  describe('#attributes', () => {
    it('returns its attributes', () => {
      const appSerializer = new ApplicationSerializer({ attributes: ['name', 'createdAt'] });
      expect(appSerializer.attributes).to.be.deep.equal(['name', 'createdAt']);
    });
  });

  describe('#buildSerializer', () => {
    it('creates an instance of jsonapi-serializer that serializes the resource', () => {
      const appSerializer = new ApplicationSerializer({ type: 'bands', attributes: ['name', 'createdAt'] });
      const serializer = appSerializer.buildSerializer();

      const input = {
        id: 666,
        name: 'Iron Maiden',
        createdAt: '1979',
      };

      const output = {
        data: {
          type: 'bands',
          id: '666',
          attributes: {
            name: 'Iron Maiden',
            'created-at': '1979',
          },
        },
      };

      expect(serializer.serialize(input)).to.be.deep.equal(output);
    });

    context('when the resource has relationships', () => {
      const albumSerializer = new ApplicationSerializer({ type: 'albuns', attributes: ['name'] });
      const bandSerializer = new ApplicationSerializer({
        type: 'bands',
        attributes: ['name', 'createdAt'],
        relationships: [albumSerializer],
      });

      context('when the relationship is not included', () => {
        it('creates an instance that serializes the resource and its relations', () => {
          const serializer = bandSerializer.buildSerializer();
          const input = {
            id: 666,
            name: 'Iron Maiden',
            createdAt: '1979',
            albuns: [
              {
                id: 7,
                name: 'Seventh son of a seventh son',
              },
            ],
          };

          const output = {
            data: {
              type: 'bands',
              id: '666',
              attributes: {
                name: 'Iron Maiden',
                'created-at': '1979',
              },
              relationships: {
                albuns: {
                  data: [
                    {
                      type: 'albuns',
                      id: '7',
                    },
                  ],
                },
              },
            },
          };
          expect(serializer.serialize(input)).to.be.deep.equal(output);
        });
      });

      context('when the relationship is included', () => {
        it('creates an instance that serializes the resource and its relations and includes them', () => {
          const serializer = bandSerializer.buildSerializer(true);
          const input = {
            id: 666,
            name: 'Iron Maiden',
            createdAt: '1979',
            albuns: [
              {
                id: 7,
                name: 'Seventh son of a seventh son',
              },
            ],
          };

          const output = {
            data: {
              type: 'bands',
              id: '666',
              attributes: {
                name: 'Iron Maiden',
                'created-at': '1979',
              },
              relationships: {
                albuns: {
                  data: [
                    {
                      type: 'albuns',
                      id: '7',
                    },
                  ],
                },
              },
            },
            included: [
              {
                type: 'albuns',
                id: '7',
                attributes: {
                  name: 'Seventh son of a seventh son',
                },
              },
            ],
          };

          expect(serializer.serialize(input)).to.be.deep.equal(output);
        });
      });
    });
  });

  describe('#buildDeserializer', () => {
    it('creates an instance of jsonapi-serializer that deserializes the resource', (done) => {
      const deserializer = ApplicationSerializer.buildDeserializer();

      const input = {
        data: {
          type: 'bands',
          id: '666',
          attributes: {
            name: 'Iron Maiden',
          },
        },
      };

      const output = {
        id: '666',
        name: 'Iron Maiden',
      };

      deserializer.deserialize(input)
        .then((result) => {
          expect(result).to.be.deep.equal(output);
          done();
        });
    });
  });
});
