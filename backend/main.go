package main

import (
	"encoding/json"
	docs "example/docs"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var db_user = os.Getenv("DB_USER")
var db_pass = os.Getenv("DB_PASSWORD")

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	docs.SwaggerInfo.BasePath = "/api/v1"

	v1 := r.Group("/api/v1")
	{
		twitter := v1.Group("/twitter")
		{
			twitter.GET("/sentiment", getTwitterSentiment)
			twitter.GET("/count", getTwitterCount)
		}
		mastodon := v1.Group("/mastodon")
		{
			mental := mastodon.Group("/mental")
			{
				mental.GET("/count", getMastodonMentalCount)
				mental.GET("/output", getMastodonMentalOutput)
			}
			nonMental := mastodon.Group("/non-mental")
			{
				nonMental.GET("/count", getMastodonNonMentalCount)
				nonMental.GET("/output", getMastodonNonMentalOutput)
			}
		}
	}

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.Run(":8080")
}

func getTwitterSentiment(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/tweets/_design/tw_sentiment/_view/avg_gcc_sentiment?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getTwitterCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/tweets/_design/tw_count/_view/count_sentiment?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getMastodonMentalCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/mental_disabled_db/_design/mastodon_mental_count/_view/count_view?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getMastodonMentalOutput(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/mental_disabled_db/_design/mastodon_mental_output/_view/avg_score_view?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getMastodonNonMentalCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/non_mental_disabled_db/_design/mastodon_non_mental_count/_view/count_view?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getMastodonNonMentalOutput(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@172.26.134.155:5984/non_mental_disabled_db/_design/mastodon_non_mental_output/_view/avg_score_view?group_level=1",
		db_user, db_pass)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

func getData(url string) (map[string]interface{}, error) {
	resp, err := http.Get(url)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var raw map[string]interface{}

	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, err
	}

	return raw, nil
}
