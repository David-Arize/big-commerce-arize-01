import { initializeApp } from "firebase/app";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SessionProps, UserData } from "../../types";

// Firebase config and initialization
// Prod applications might use config file
const { FIRE_API_KEY, FIRE_DOMAIN, FIRE_PROJECT_ID } = process.env;
const firebaseConfig = {
  apiKey: FIRE_API_KEY,
  authDomain: FIRE_DOMAIN,
  projectId: FIRE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore data management functions

// Use setUser for storing global user data (persists between installs)
export async function setUser({ user }: SessionProps) {
  if (!user) return null;

  const { email, id, username } = user;
  const ref = doc(db, "users", String(id));
  const data: UserData = { email };

  if (username) {
    data.username = username;
  }

  await setDoc(ref, data, { merge: true });
}

export async function setStore(session: SessionProps) {
  const {
    access_token: accessToken,
    context,
    scope,
    user: { id },
  } = session;
  // Only set on app install or update
  if (!accessToken || !scope) return null;

  const storeHash = context?.split("/")[1] || "";

  try {
    const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/content/widget-templates`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": accessToken,
      },
      body: JSON.stringify({
        name: "Product 2",
        schema: [
          {
            type: "hidden",
            settings: [
              {
                type: "graphQl",
                id: "graphQueries",
                typeMeta: {
                  mappings: {
                    productId: {
                      reads: "productId",
                      type: "Int",
                    },
                  },
                },
              },
            ],
          },
          {
            type: "tab",
            label: "Content",
            sections: [
              {
                label: "Product",
                settings: [
                  {
                    type: "productId",
                    label: "Product",
                    id: "productId",
                    default: "",
                    typeMeta: {
                      placeholder: "Search by name or SKU",
                    },
                  },
                ],
              },
              {
                label: "Elements",
                settings: [
                  {
                    type: "alignment",
                    label: "Content alignment",
                    id: "productCardContentAlignment",
                    default: {
                      horizontal: "center",
                    },
                    typeMeta: {
                      display: "horizontal",
                    },
                  },
                  {
                    type: "element",
                    label: "Product image",
                    id: "productImage",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "show",
                        },
                        advanced: {
                          label: "Product image style",
                          settings: [
                            {
                              type: "select",
                              label: "Image fit",
                              id: "imageFit",
                              default: "fill",
                              typeMeta: {
                                selectOptions: [
                                  {
                                    label: "Scale to fill box",
                                    value: "fill",
                                  },
                                  {
                                    label: "Scale to fit box",
                                    value: "fit",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    type: "element",
                    label: "Brand",
                    id: "brand",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "show",
                        },
                        advanced: {
                          label: "Brand style",
                          settings: [
                            {
                              type: "typography",
                              label: "Text",
                              id: "textStyle",
                              default: "default",
                            },
                            {
                              type: "color",
                              label: "Text color",
                              id: "color",
                              default: "#444444",
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    type: "element",
                    label: "Product name",
                    id: "productName",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "show",
                        },
                        advanced: {
                          label: "Product name style",
                          settings: [
                            {
                              type: "typography",
                              label: "Text",
                              id: "textStyle",
                              default: "default",
                            },
                            {
                              type: "color",
                              label: "Text color",
                              id: "color",
                              default: "#444444",
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    type: "element",
                    label: "Price",
                    id: "price",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "show",
                        },
                        advanced: {
                          label: "Price style",
                          settings: [
                            {
                              type: "typography",
                              label: "Text",
                              id: "textStyle",
                              default: "default",
                            },
                            {
                              type: "color",
                              label: "Text color",
                              id: "color",
                              default: "#444444",
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    type: "element",
                    label: "Product rating",
                    id: "productRating",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "hide",
                        },
                        advanced: {
                          label: "Product rating style",
                          settings: [
                            {
                              type: "color",
                              label: "Star color (filled)",
                              id: "starColorFilled",
                              default: "#3C64F4",
                            },
                            {
                              type: "color",
                              label: "Star color (empty)",
                              id: "starColorEmpty",
                              default: "#ECEEF5",
                            },
                            {
                              type: "color",
                              label: "Reviews text color",
                              id: "reviewsColor",
                              default: "#8C93AD",
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    type: "element",
                    label: "Button",
                    id: "button",
                    typeMeta: {
                      controls: {
                        visibility: {
                          default: "hide",
                        },
                        advanced: {
                          label: "Button style",
                          settings: [
                            {
                              type: "select",
                              label: "Button shape",
                              id: "shape",
                              default: "round",
                              typeMeta: {
                                selectOptions: [
                                  {
                                    label: "Round",
                                    value: "round",
                                  },
                                  {
                                    label: "Square",
                                    value: "square",
                                  },
                                  {
                                    label: "Pill",
                                    value: "pill",
                                  },
                                ],
                              },
                            },
                            {
                              type: "color",
                              label: "Button color",
                              id: "buttonColor",
                              default: "rgba(68,68,68,1)",
                            },
                            {
                              type: "typography",
                              label: "Button text",
                              id: "textStyle",
                              default: "default",
                            },
                            {
                              type: "color",
                              label: "Button text color",
                              id: "buttonTextColor",
                              default: "rgba(255,255,255,1)",
                            },
                            {
                              type: "select",
                              label: "Button action",
                              id: "buttonActionType",
                              default: "addToCart",
                              typeMeta: {
                                selectOptions: [
                                  {
                                    label: "Add to Cart",
                                    value: "addToCart",
                                  },
                                  {
                                    label: "Add to Wishlist",
                                    value: "addToWishlist",
                                  },
                                  {
                                    label: "Go to Product Page",
                                    value: "goToProduct",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        template:
          '<div id="bc-product-{{_.id}}"></div>\n\n{{#with ../_.data.site.product as | productResource |}}\n  {{#if productResource.entityId "==" productId}}\n    <script type="application/ld+json">\n      {\n        "@context": "https://schema.org/",\n        "@type": "Product",\n        "name": "{{productResource.name}}",\n        "image": "{{productResource.defaultImage.url}}",\n        "brand": "{{productResource.brand.name}}",\n        "sku": "{{productResource.sku}}",\n        "aggregateRating": {\n          "@type": "AggregateRating",\n          {{#if productResource.reviewSummary.summationOfRatings "==" 0}}\n          "ratingValue": "0",\n          {{else}}\n          "ratingValue": "{{divide productResource.reviewSummary.summationOfRatings productResource.reviewSummary.numberOfReviews}}",\n          {{/if}}\n          "reviewCount": "{{productResource.reviewSummary.numberOfReviews}}"\n        },\n        "offers": {\n          "@type": "Offer",\n          "priceCurrency": "{{productResource.prices.price.currencyCode}}",\n          "price": "{{productResource.prices.price.value}}",\n          "seller": {\n            "@type": "Organization",\n            "name": "{{../../../_.data.site.settings.storeName}}"\n          }\n        }\n      }\n    </script>\n  {{/if}}\n{{/with}}\n\n<script type="text/javascript">\n  (function() {\n    var widgetConfiguration = {{{json .}}};\n    var dataIsNotPresent = typeof widgetConfiguration._.data === \'undefined\' || Object.keys(widgetConfiguration._.data || {}).length === 0;\n    var storefrontApiQueryData = widgetConfiguration._.queryData;\n\n    function executeStorefrontApiQuery(queryData, callback) {\n      // Fetch data from the GraphQL Storefront API\n      var storefrontApiRequest = new XMLHttpRequest(); // IE compatible\n      storefrontApiRequest.onreadystatechange = function() {\n        if (this.readyState == 4 && this.status == 200) {\n          callback(JSON.parse(this.response).data);\n        }\n      };\n\n      storefrontApiRequest.open(\'POST\', `/graphql`, true);\n      storefrontApiRequest.setRequestHeader(\'Authorization\', `Bearer ${queryData.storefrontApiToken}`);\n      storefrontApiRequest.setRequestHeader(\'Content-type\', \'application/json\');\n      storefrontApiRequest.send(JSON.stringify({ query: queryData.storefrontApiQuery, variables: JSON.parse(queryData.storefrontApiQueryParamsJson) }));\n    }\n\n    function executeWidget(configuration, storefrontApiData) {\n      if (storefrontApiData) {\n        configuration._.data = storefrontApiData;\n      }\n\n      if (window.BigCommerce && window.BigCommerce.initializeProduct && typeof window.BigCommerce.initializeProduct === \'function\') {\n        window.BigCommerce.initializeProduct(configuration);\n      } else {\n        var scriptTag = document.createElement(\'script\');\n        scriptTag.type = \'text/javascript\';\n        scriptTag.src = \'https://microapps.bigcommerce.com/product-widget/e82f853fd55ba06eff07f5acd957c3683e53b393/bundle.js\';\n        scriptTag.defer = true;\n        scriptTag.onload = function () { window.BigCommerce.initializeProduct(configuration) };\n        document.head.appendChild(scriptTag);\n      }\n    }\n\n    if (dataIsNotPresent && storefrontApiQueryData) {\n      executeStorefrontApiQuery(storefrontApiQueryData, function(storefrontApiData) { executeWidget(widgetConfiguration, storefrontApiData) });\n    } else {\n      executeWidget(widgetConfiguration);\n    }\n  })();\n</script>\n',
        date_created: "2022-01-21T22:59:46.824Z",
        date_modified: "2022-01-21T22:59:46.824Z",
        kind: "sd-product",
        storefront_api_query:
          "query Product($productId: Int, $activeCurrencyCode: currencyCode!) {\n  site {\n    settings {\n      storeName\n      tax {\n        plp\n      }\n    }\n    currency(currencyCode: $activeCurrencyCode) {\n      display {\n        symbol\n        symbolPlacement\n        decimalToken\n        decimalPlaces\n        thousandsToken\n      }\n    }\n    product(entityId: $productId) {\n      name\n      entityId\n      addToCartUrl\n      addToWishlistUrl\n      brand {\n        name\n      }\n      path\n      sku\n      priceWithTax: prices(includeTax: true, currencyCode: $activeCurrencyCode) {\n        price {\n          currencyCode\n          value\n        }\n      }\n      priceWithoutTax: prices(includeTax: false, currencyCode: $activeCurrencyCode) {\n        price {\n          currencyCode\n          value\n        }\n      }\n      reviewSummary {\n        summationOfRatings\n        numberOfReviews\n      }\n      defaultImage {\n        url(width: 1500, height: 1500)\n      }\n    }\n  }\n}\n\n",
        icon_name: "sd-product",
        template_engine: "handlebars_v3",
        client_rerender: false,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .catch((err) => console.error("error:" + err));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const ref = doc(db, "store", storeHash);
  const data = { accessToken, adminId: id, scope };

  await setDoc(ref, data);
}

// User management for multi-user apps
// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
  const {
    access_token: accessToken,
    context,
    owner,
    sub,
    user: { id: userId },
  } = session;
  if (!userId) return null;

  const contextString = context ?? sub;
  const storeHash = contextString?.split("/")[1] || "";
  const documentId = `${userId}_${storeHash}`; // users can belong to multiple stores
  const ref = doc(db, "storeUsers", documentId);
  const storeUser = await getDoc(ref);

  // Set admin (store owner) if installing/ updating the app
  // https://developer.bigcommerce.com/api-docs/apps/guide/users
  if (accessToken) {
    // Create a new admin user if none exists
    if (!storeUser.exists()) {
      await setDoc(ref, { storeHash, isAdmin: true });
    } else if (!storeUser.data()?.isAdmin) {
      await updateDoc(ref, { isAdmin: true });
    }
  } else {
    // Create a new user if it doesn't exist
    if (!storeUser.exists()) {
      await setDoc(ref, { storeHash, isAdmin: owner.id === userId }); // isAdmin true if owner == user
    }
  }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
  const contextString = context ?? sub;
  const storeHash = contextString?.split("/")[1] || "";
  const docId = `${user?.id}_${storeHash}`;
  const ref = doc(db, "storeUsers", docId);

  await deleteDoc(ref);
}

export async function hasStoreUser(storeHash: string, userId: string) {
  if (!storeHash || !userId) return false;

  const docId = `${userId}_${storeHash}`;
  const userDoc = await getDoc(doc(db, "storeUsers", docId));

  return userDoc.exists();
}

export async function getStoreToken(storeHash: string) {
  if (!storeHash) return null;
  const storeDoc = await getDoc(doc(db, "store", storeHash));

  return storeDoc.data()?.accessToken ?? null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
  const ref = doc(db, "store", storeHash);

  await deleteDoc(ref);
}
