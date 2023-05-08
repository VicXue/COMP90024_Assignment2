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
var db_pass = os.Getenv("DB_PASS")
var db_host = os.Getenv("DB_HOST")

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

// @title           Team 3 Gin Web Service
// @version         1.0
// @description     A web service API in Go using Gin framework

// @contact.name    Quanchi Chen
// @contact.email   quanchic@student.unimelb.edu.au

// @BasePath        /api/v1

// @Summary return tw_sentiment
// @Description return the tw_sentiment MapReduce view in the tweets database
// @Tags twitter
// @Accept json
// @Produce json
// @Success 200 {string} getTwitterSentiment
// @Router /twitter/sentiment [get]
func getTwitterSentiment(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/tweets/_design/tw_sentiment/_view/avg_gcc_sentiment?group_level=1",
		db_user, db_pass, db_host)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary return tw_count
// @Description return the tw_count MapReduce view in the tweets database
// @Tags twitter
// @Accept json
// @Produce json
// @Success 200 {string} getTwitterCount
// @Router /twitter/count [get]
func getTwitterCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/tweets/_design/tw_count/_view/count_sentiment?group_level=1",
		db_user, db_pass, db_host)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary return mastodon_mental_count
// @Description return the mastodon_mental_count MapReduce view in the mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} getMastodonMentalCount
// @Router /mastodon/mental/count [get]
func getMastodonMentalCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/mental_disabled_db/_design/mastodon_mental_count/_view/count_view?group_level=1",
		db_user, db_pass, db_host)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary return mastodon_mental_output
// @Description return the mastodon_mental_output MapReduce view in the mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} getMastodonMentalOutput
// @Router /mastodon/mental/output [get]
func getMastodonMentalOutput(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/mental_disabled_db/_design/mastodon_mental_output/_view/avg_score_view?group_level=1",
		db_user, db_pass, db_host)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary return mastodon_non_mental_count
// @Description return the mastodon_non_mental_count MapReduce view in the non_mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} getMastodonNonMentalCount
// @Router /mastodon/non-mental/count [get]
func getMastodonNonMentalCount(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/non_mental_disabled_db/_design/mastodon_non_mental_count/_view/count_view?group_level=1",
		db_user, db_pass, db_host)
	data, err := getData(url)
	if err != nil {
		log.Fatalln(err)
	}
	g.JSON(http.StatusOK, gin.H{"data": data})
}

// @Summary return mastodon_non_mental_output
// @Description return the mastodon_non_mental_output MapReduce view in the non_mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} getMastodonNonMentalOutput
// @Router /mastodon/non-mental/output [get]
func getMastodonNonMentalOutput(g *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/non_mental_disabled_db/_design/mastodon_non_mental_output/_view/avg_score_view?group_level=1",
		db_user, db_pass, db_host)
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
