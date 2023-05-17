package main

import (
	"example/controllers"
	"example/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"log"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	docs.SwaggerInfo.BasePath = "/api/v1"

	v1 := r.Group("/api/v1")
	{
		twitter := v1.Group("/twitter")
		{
			twitter.GET("/sentiment", controllers.GetTwitterSentiment)
			twitter.GET("/count", controllers.GetTwitterCount)
		}
		mastodon := v1.Group("/mastodon")
		{
			mental := mastodon.Group("/mental")
			{
				mental.GET("/count", controllers.GetMastodonMentalCount)
				mental.GET("/output", controllers.GetMastodonMentalOutput)
			}
			nonMental := mastodon.Group("/non-mental")
			{
				nonMental.GET("/count", controllers.GetMastodonNonMentalCount)
				nonMental.GET("/output", controllers.GetMastodonNonMentalOutput)
			}
		}
		geography := v1.Group("/geography")
		{
			geography.GET("/gcc", controllers.GetGeographyGCCData)
			geography.GET("/lga", controllers.GetGeographyLGAData)
		}
		analysis := v1.Group("/analysis")
		{
			analysis.GET("/victoria-expenses", controllers.GetVictoriaExpenses)
		}
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	err := r.Run(":8080")
	if err != nil {
		log.Fatalln("Server Started Unsuccessfully")
	}
}

// @title           Team 3 Gin Web Service
// @version         1.0
// @description     A web service API in Go using the Gin framework

// @contact.name    Quanchi Chen
// @contact.email   quanchic@student.unimelb.edu.au

// @BasePath        /api/v1
