package controllers

import (
	"example/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// GetGeographyGCCData
// @Summary return gcc_pt
// @Description return gcc_pt in the geography_db database
// @Tags geography
// @Accept json
// @Produce json
// @Success 200 {string} getGeographyGCCData
// @Router /geography/gcc [get]
func GetGeographyGCCData(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/geography_db/0db59c7ef8e1af81bf1079747c29fa28",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// GetGeographyLGAData
// @Summary return lga_copy
// @Description return lga_copy in the geography_db database
// @Tags geography
// @Accept json
// @Produce json
// @Success 200 {string} getGeographyLGAData
// @Router /geography/lga [get]
func GetGeographyLGAData(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/geography_db/b51ae8d6de3ee81bbf4fa816489148e4",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}
