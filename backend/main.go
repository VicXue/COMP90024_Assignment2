package main

import (
	docs "example/docs"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @BasePath /api/v1

// PingExample godoc
// @Summary preturn docs in the order db
// @Schemes
// @Description return docs in the order db
// @Tags example
// @Accept json
// @Produce json
// @Success 200 {string} FetchDocs
// @Router /example/fetchdocs [get]
func FetchDocs(g *gin.Context) {
	db_host := os.Getenv("DB_HOST")
	db_user := os.Getenv("DB_USER")
	db_pass := os.Getenv("DB_PASS")
	resp, err := http.Get(fmt.Sprintf("http://%v:%v@%v:5984/orders/_all_docs", db_user, db_pass, db_host))
	if err != nil {
		log.Fatalln(err)
	}
	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	//Convert the body to type string
	sb := string(body)
	log.Printf(sb)
	g.JSON(http.StatusOK, sb)
}

func main() {
	r := gin.Default()
	// Enable CORS middleware
	r.Use(cors.Default())
	docs.SwaggerInfo.BasePath = "/api/v1"
	v1 := r.Group("/api/v1")
	{
		eg := v1.Group("/example")
		{
			eg.GET("/fetchdocs", FetchDocs)
		}
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.Run(":8080")
}
